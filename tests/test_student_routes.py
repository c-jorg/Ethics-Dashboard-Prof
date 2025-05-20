import json
from app.models import *
import pytest

def test_add_single_student_success(client, db_session,  professor_class_ta_fixture):
    """
    GIVEN POST /api/students
    WHEN a single valid student email and class is provided
    THEN response should be 201 and success message
    """
    class1_id, class2_id, no_class_prof_id, two_class_prof_id, ta_id =  professor_class_ta_fixture
    response = client.post('/api/students',
                data = json.dumps({"class_id":class1_id, "students":[{"email":"example1@example.com"}]}),
                headers = {'Content-Type': 'application/json'})
    assert response.status_code == 201
    assert response.json['message'] == 'Students added to class successfully'
    assert len(db_session.query(Student).filter(Student.email == "example1@example.com").all()) == 1
    
def test_add_multiple_students_success(client, db_session, professor_class_ta_fixture):
    """
    GIVEN POST /api/students
    WHEN multiple valid students and a class id is provided
    THEN response should be 201 and success message
    """
    class1_id, class2_id, no_class_prof_id, two_class_prof_id, ta_id =  professor_class_ta_fixture
    response = client.post('/api/students',
                data = json.dumps({"class_id":class1_id, "students":[{"email":"example2@example.com"},{"email":"example3@example.com"},{"email":"example4@example.com"}]}),
                headers = {'Content-Type': 'application/json'})
    assert response.status_code == 201
    assert response.json['message'] == 'Students added to class successfully'
    assert len(db_session.query(Student).filter(Student.email == "example2@example.com").all()) == 1
    assert len(db_session.query(Student).filter(Student.email == "example3@example.com").all()) == 1
    assert len(db_session.query(Student).filter(Student.email == "example4@example.com").all()) == 1
    
def test_add_student_no_class_id(client, db_session, professor_class_ta_fixture):
    """
    GIVEN POST /api/students
    WHEN multiple no class id is provided
    THEN response should be 400 and fail message
    """
    class1_id, class2_id, no_class_prof_id, two_class_prof_id, ta_id =  professor_class_ta_fixture
    response = client.post('/api/students',
                data = json.dumps({ "students":[{"email":"example10@example.com"}]}),
                headers = {'Content-Type': 'application/json'})
    assert response.status_code == 400
    assert response.json['message'] == 'Must provide class id'
    assert len(db_session.query(Student).filter(Student.email == "example10@example.com").all()) == 0

def test_add_student_empty_list(client, db_session, professor_class_ta_fixture):
    """
    GIVEN POST /api/students
    WHEN no students are provided
    THEN response should be 400 and fail message
    """
    class1_id, class2_id, no_class_prof_id, two_class_prof_id, ta_id =  professor_class_ta_fixture
    response = client.post('/api/students',
                data = json.dumps({"class_id":class1_id, "students":[]}),
                headers = {'Content-Type': 'application/json'})
    assert response.status_code == 400
    assert response.json['message'] == 'Must provide at least one student email'
    
def test_add_student_no_students(client, db_session, professor_class_ta_fixture):
    """
    GIVEN POST /api/students
    WHEN no students are provided
    THEN response should be 400 and fail message
    """
    class1_id, class2_id, no_class_prof_id, two_class_prof_id, ta_id =  professor_class_ta_fixture
    response = client.post('/api/students',
                data = json.dumps({"class_id":class1_id}),
                headers = {'Content-Type': 'application/json'})
    assert response.status_code == 400
    assert response.json['message'] == 'Must provide at least one student email'
    
def test_add_student_bad_class_id(client, db_session, professor_class_ta_fixture):
    """
    GIVEN POST /api/students
    WHEN no students are provided
    THEN response should be 400 and fail message
    """
    class1_id, class2_id, no_class_prof_id, two_class_prof_id, ta_id =  professor_class_ta_fixture
    response = client.post('/api/students',
                data = json.dumps({"class_id":"asf", "students":[{"email":"example5@example.com"}]}),
                headers = {'Content-Type': 'application/json'})
    assert response.status_code == 400
    assert response.json['message'] == 'Invalid data type provided'
    
    