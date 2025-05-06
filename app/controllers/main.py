from flask import Blueprint, jsonify, request
from ..models.professor import Professor
from ..models.school_class import Class
from ..models.student import Student
from ..models.enrollment import Enrollment
from .. import db
from sqlalchemy.exc import IntegrityError


main_bp = Blueprint('main', __name__, url_prefix='/api')

@main_bp.route('/ping', methods=['GET'])
def ping():
    return jsonify({'message': 'Pong!'})


@main_bp.route('/professors/signup', methods=['POST'])
def professor_signup():
    data = request.get_json()
    # print(data)
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not name or not email or not password:
        return jsonify({'message': 'Missing required fields'}), 400

    new_professor = Professor(name=name, email=email, password=password)
    db.session.add(new_professor)
    db.session.commit()
    return jsonify({'message': 'Professor created successfully'}), 201

@main_bp.route('/professors/login', methods=['POST'])
def professor_login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'message': 'Missing email or password'}), 400

    try:
        # Find the professor by email
        professor = Professor.get_professor_by_email(email)

        if not professor:
            return jsonify({'message': 'Invalid email or password'}), 401

        # Check if password matches
        if professor.password != password:  # In production, use proper password hashing
            return jsonify({'message': 'Invalid email or password'}), 401

        # Create session data
        return jsonify({
            'message': 'Login successful',
            'professor': {
                'id': professor.id,
                'name': professor.name,
                'email': professor.email
            }
        }), 200

    except Exception as e:
        return jsonify({'message': f'Error during login: {str(e)}'}), 500

