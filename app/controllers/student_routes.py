from flask import Blueprint, jsonify
from ..models.student import Student

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