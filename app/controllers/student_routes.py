from flask import Blueprint, jsonify, request
from ..models.student import Student, Enrollment

student_bp = Blueprint('student', __name__, url_prefix='/api')


@student_bp.route('/students/<student_id>', methods=['GET'])
def get_student(student_id):
    try:
        # Find the student by ID
        student = Student.query.filter_by(id=student_id).first()

        if not student:
            return jsonify({"message": "Student not found"}), 404

        # Return student details
        student_data = {
            'id': student.id,
            'name': student.name,
            'email': student.email
        }

        return jsonify(student_data), 200
    except Exception as e:
        return jsonify({'message': f'Error fetching student: {str(e)}'}), 500
    
@student_bp.route('/students', methods=['POST'])
def add_students():
    try:
        data = request.get_json()
        class_id = data.get('class_id')
        student_emails = data.get('students')
        print(f'{class_id} type {type(class_id)}', flush=True)
        print(f'student_emails type {type(student_emails)}', flush=True)
        # try:
        #     class_id = int(class_id)
        # except Exception as e:
        #     return jsonify({"message":"Invalid data type provided"}), 400
            #return jsonify({"message":"Must provide class id"}), 400
        if not class_id:
            return jsonify({"message":"Must provide class id"}), 400
        if not student_emails:
            return jsonify({"message":"Must provide at least one student email"}), 400
        if type(class_id) != int or type(student_emails) != list:
            return jsonify({"message":"Invalid data type provided"}), 400
        # if type(class_id) != int:
        #     return jsonify({"message":"Invalid data type provided"}), 400
        if len(student_emails) == 0:
            return jsonify({'message':'Must provide at least one student email'}), 400
        
        print(f"adding students {student_emails}", flush=True)
        for student in student_emails:
            email = student.get('email')
            if email is None:
                print("no student email", flush=True)
                continue
            print(f'getting student_id with email {email}',flush=True)
            student_id = Student.get_student_id_by_email(email)
            print(student_id, flush=True)
            if student_id:
                enrollment = Enrollment.get_enrollment_by_student_id_and_class_id(student_id, class_id)
                if not enrollment:
                    print('not existing enrollment', flush=True)
                    Enrollment.enroll_student(student_id, class_id)
            else:
                print('new student, adding email and enrolling', flush=True)
                Student.post_student_email(email)
                student_id = Student.get_student_id_by_email(email)
                Enrollment.enroll_student(student_id, class_id)
        return jsonify({"message":"Students added to class successfully"}), 201

            
    except Exception as e:
        return jsonify({'message':'Error adding students'}), 500