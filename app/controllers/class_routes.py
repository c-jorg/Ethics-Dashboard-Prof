from flask import Blueprint, jsonify, make_response, request
from ..models import Class, Student, Professor, Enrollment
#from .. import db
from sqlalchemy.exc import IntegrityError

class_bp = Blueprint('class', __name__, url_prefix='/api')

@class_bp.route('/classes/<int:prof_id>', methods=['GET'])
def get_professor_classes(prof_id):
    try:
        prof_exists = Professor.get_professor_by_id(prof_id)
        if not prof_exists:
            return jsonify({"message":"No professor found with this id"}), 404
        classes = Class.query.filter_by(prof_id=prof_id).all()
        if len(classes) == 0:
            return jsonify({'message': 'No classes found for this professor'}), 404 
        classes_list = []
        for cls in classes:
            classes_list.append({
                'class_id': cls.id,
                'class_name': cls.class_name,
                'prof_id': cls.prof_id
            })
        return jsonify(classes_list), 200
    except Exception as e:
        return jsonify({'message': f'Error fetching classes: {str(e)}'}), 500


@class_bp.route('/add-class', methods=['POST'])
def add_class():
    data = request.get_json()
    try:
        #class_id = int(data.get('class_id'))
        class_name = data.get('class_name')
        professor_id = int(data.get('professor_id'))
        class_code = data.get('class_code')
        students = data.get('students')
    except (TypeError, ValueError):
        return jsonify({'success': False, 'message': 'Invalid input data'}), 400

    if not all([class_code, class_name, professor_id, class_code, students]):
        return jsonify({'success': False, 'message': 'Missing required fields'}), 400

    # Check if class_id already exists
    if Class.get_class_by_class_code(class_code):
        return jsonify({'success': False, 'message': 'Class with that code already exists'}), 400

    Class.post_class(class_name, professor_id, class_code)
    if Class.get_class_by_class_code(class_code):
        return make_response(jsonify({"message":"error making class"}, 500))
    class_id = Class.get_class_id_by_class_code(class_code)
    # Process students and create enrollments
    for student_data in students:

        #name = student_data.get('name')
        email = student_data.get('email')
        if not email:
            #db.session.rollback()
            return jsonify({'success': False, 'message': 'Missing student email'}), 400

        # Check if student already exists by or email
        student = Student.get_student_by_email(email)
        #if they dont exist add them to students table, if they do exist thats fine
        if not student:
            Student.post_student_email(email)
        student_id = Student.get_student_id_by_email(email)
        # Check if enrollment already exists
        enrollment = Enrollment.get_enrollment_by_student_id_and_class_id(student_id, class_id)

        if not enrollment:
            # Create enrollment if it doesn't exist
            try:
                Enrollment.enroll_student(student_id, class_id)
            except Exception as e:
                #db.session.rollback()
                return jsonify({'success': False, 'message': f'Error creating enrollment: {str(e)}'}), 500

    try:
        #db.session.commit()
        return make_response(jsonify({'success': True, 'message': 'Class and students created successfully'}), 201)
    except IntegrityError as e:
        #db.session.rollback()
        return jsonify({'success': False, 'message': f'Database integrity error: {str(e)}'}), 400
    except Exception as e:
        #db.session.rollback()
        return make_response(jsonify({'success': False, 'message': f'Error: {str(e)}'}), 500)


@class_bp.route('/class/<int:class_id>', methods=['GET'])
def get_class_by_id(class_id):
    try:
        cls = Class.query.get(class_id)
        if not cls:
            return jsonify({'message': 'Class not found'}), 404

        class_data = {
            'class_id': cls.id,
            'class_name': cls.class_name,
            'prof_id': cls.prof_id
        }
        return jsonify(class_data), 200
    except Exception as e:
        return jsonify({'message': f'Error fetching class: {str(e)}'}), 500


@class_bp.route('/class/<int:class_id>/students', methods=['GET'])
def get_class_students(class_id):
    try:
        # Find all enrollments for this class
        enrollments = Enrollment.query.filter_by(class_id=class_id).all()

        if not enrollments:
            return jsonify([]), 200

        # Get student IDs from enrollments
        student_ids = [enrollment.student_id for enrollment in enrollments]

        # Get all students with these IDs
        students = Student.query.filter(Student.id.in_(student_ids)).all()

        # Format student data
        students_list = []
        for student in students:
            students_list.append({
                'id': student.id,
                'name': student.name,
                'email': student.email,
                'submissions': []  # You can populate this with actual submissions if needed
            })

        return jsonify(students_list), 200
    except Exception as e:
        return jsonify({'message': f'Error fetching class students: {str(e)}'}), 500