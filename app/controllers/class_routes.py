from flask import Blueprint, jsonify, request
from ..models import Class, Student, Professor, Enrollment
from .. import db
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
        class_id = int(data.get('class_id'))
        class_name = data.get('class_name')
        professor_id = int(data.get('professor_id'))
        students = data.get('students')
    except (TypeError, ValueError):
        return jsonify({'success': False, 'message': 'Invalid input data'}), 400

    if not all([class_id, class_name, professor_id, students]):
        return jsonify({'success': False, 'message': 'Missing required fields'}), 400

    # Check if class_id already exists
    if Class.query.get(class_id):
        return jsonify({'success': False, 'message': 'Class ID already exists'}), 400

    new_class = Class(class_name=class_name, prof_id=professor_id)
    new_class.id = class_id
    db.session.add(new_class)

    # Process students and create enrollments
    for student_data in students:
        try:
            student_id = int(student_data['id'])
        except (TypeError, ValueError):
            db.session.rollback()
            return jsonify({'success': False, 'message': 'Invalid student ID'}), 400

        name = student_data.get('name')
        email = student_data.get('email')
        if not name or not email:
            db.session.rollback()
            return jsonify({'success': False, 'message': 'Missing student name or email'}), 400

        # Check if student already exists by ID or email
        student = Student.query.get(student_id)
        if not student:
            student_by_email = Student.query.filter_by(email=email).first()
            if student_by_email:
                # If email exists but ID doesn't match, return error
                if student_by_email.id != student_id:
                    db.session.rollback()
                    return jsonify(
                        {'success': False, 'message': f'Email {email} already exists with different ID'}), 400
                student = student_by_email
            else:
                # Create new student if not exists
                student = Student(name=name, email=email, password=None)
                student.id = student_id
                db.session.add(student)

        # Check if enrollment already exists
        existing_enrollment = Enrollment.query.filter_by(
            class_id=class_id,
            student_id=student_id
        ).first()

        if not existing_enrollment:
            # Create enrollment if it doesn't exist
            try:
                # Get the next available ID (simplified approach)
                max_id_result = db.session.query(db.func.max(Enrollment.id)).scalar()
                next_id = 1 if max_id_result is None else max_id_result + 1

                # Create enrollment with explicit ID
                enrollment = Enrollment(class_id=class_id, student_id=student_id)
                enrollment.id = next_id
                db.session.add(enrollment)
            except Exception as e:
                db.session.rollback()
                return jsonify({'success': False, 'message': f'Error creating enrollment: {str(e)}'}), 500

    try:
        db.session.commit()
        return jsonify({'success': True, 'message': 'Class and students created successfully'}), 201
    except IntegrityError as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': f'Database integrity error: {str(e)}'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': f'Error: {str(e)}'}), 500


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