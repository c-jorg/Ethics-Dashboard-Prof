import json
from app.models import *
import pytest


@pytest.fixture(scope='function', autouse=False)
def student_fixture(client, db_session):
    student_list = [{"name":"student1","email":"student1@mail.com"},
                {"name":"student2","email":"student2@mail.com"},
                {"name":"student3","email":"student3@mail.com"}]
    student_list_full = [{"name":"student1","email":"student1@mail.com"},
                {"name":"student2","email":"student2@mail.com"},
                {"name":"student3","email":"student3@mail.com"},
                {"name":"student4","email":"student4@mail.com"}]
    Student.post_student_email(student_list_full[3]['email'])
    Enrollment.enroll_student(Class.get_class_id_by_class_name('class1'), Student.get_student_id_by_email(student_list_full[3]['email']))
    return student_list, student_list_full
    #db_session.rollback()


def test_get_professor_classes_empty(client):
    """
    GIVEN GET /api/classes/<int:prof_id> 
    WHEN prof_id is valid and the professor has no classes
    THEN response should be 404 and message
    """
    
    prof_id = Professor.get_professor_id_by_professor_name('no classes')
    response = client.get(f'/api/classes/{prof_id}')
    print(response.data)
    assert response.status_code == 404
    assert 'message' in response.json == {"message":"No classes found for this professor"}
    
def test_get_professor_classes_success(client):
    """
    GIVEN GET /api/classes/<int:prof_id> 
    WHEN prof_id is valid and the professor has  classes
    THEN response should be 200 and list of classes
    """
    
    prof_id = Professor.get_professor_id_by_professor_name('2 classes')
    response = client.get(f'/api/classes/{prof_id}')
    print(response.data)
    assert response.status_code == 200
    assert len(response.json) == 2
    assert 'class_id' in response.json['classes'][0] != None
    assert 'class_name' in response.json['classes'][0] != None
    assert 'prof_id' in response.json['classes'][0] != None
    assert 'class_code' in response.json['classes'][0] != None
    
def test_get_professor_classes_invalid_id(client):
    """
    GIVEN GET /api/classes/<int:prof_id> 
    WHEN prof_id is invalid 
    THEN response should be 404 and message
    """
    
    prof_id = 0
    response = client.get(f'/api/classes/{prof_id}')
    print(response.data)
    assert response.status_code == 404
    assert 'message' in response.json == {"message":"No professor found with this id"}
    
def test_get_class_by_id_success(client, professor_class_ta_fixture):
    """
    GIVEN GET /api/class/<int:class_id>
    WHEN the request is valid
    THEN response should be 200 and class data
    """
    class1_id, class2_id, no_class_prof_id, two_class_prof_id, ta_id = professor_class_ta_fixture
    response = client.get(f'/api/class/{class1_id}')
    print(response.data)
    assert response.status_code == 200
    assert 'class_id' in response.json != None
    assert 'class_name' in response.json != None 
    assert 'prof_id' in response.json != None
    assert 'class_code' in response.json != None
    assert response.json['message'] == 'Successfully fetched class data'
    
def test_get_class_by_id_bad_id(client, professor_class_ta_fixture):
    """
    GIVEN GET /api/class/<int:class_id>
    WHEN the request has invalid data types
    THEN response should be 404 (Flask will automatically give 404 before the method is executed if class_id is not int)
    """
    #class1_id, class2_id, no_class_prof_id, two_class_prof_id, ta_id = professor_class_ta_fixture
    response = client.get(f'/api/class/t1')
    print(response.data)
    assert response.status_code == 404
    #assert 'message' in response.json == {"message":"Invalid input data"}
    
def test_get_class_by_id_doesnt_exist(client, professor_class_ta_fixture):
    """
    GIVEN GET /api/class/<int:class_id>
    WHEN the request contains a class_id that doesnt exist
    THEN response should be 404 and message
    """
    #class1_id, class2_id, no_class_prof_id, two_class_prof_id, ta_id = professor_class_ta_fixture
    response = client.get(f'/api/class/7364763')
    print(response.data)
    assert response.status_code == 404
    assert 'message' in response.json == {"message":"Class not found"}
    
def test_get_class_students_success(client, professor_class_ta_fixture, student_fixture):
    """
    GIVEN GET /api/class/<int:class_id>/students
    WHEN the request is valid
    THEN response should be 200 and student list
    """
    class1_id, class2_id, no_class_prof_id, two_class_prof_id, ta_id = professor_class_ta_fixture
    #student_list, student_list_full = student_fixture
    response = client.get(f'/api/class/{class1_id}/students')
    print(response.data)
    #students_response = response.json['students_list']
    #print(students_response)
    assert response.status_code == 200
    assert len(response.json) == 1
    assert 'name' in response.json[0]
    assert 'email' in response.json[0]
    
def test_get_class_students_empty_list(client, professor_class_ta_fixture, student_fixture):
    """
    GIVEN GET /api/class/<int:class_id>/students
    WHEN the request is valid
    THEN response should be 200 and student list length 0
    """
    class1_id, class2_id, no_class_prof_id, two_class_prof_id, ta_id = professor_class_ta_fixture
    #student_list, student_list_full = student_fixture
    response = client.get(f'/api/class/{class2_id}/students')
    print(response.data)
    assert response.status_code == 200
    assert len(response.json) == 0
    
def test_get_class_students_bad_id(client, professor_class_ta_fixture, student_fixture):
    """
    GIVEN GET /api/class/<int:class_id>/students
    WHEN the request is an invalid data type
    THEN response should be 404 (Flask makes 404 if invalid data type in request)
    """
    #class1_id, class2_id, no_class_prof_id, two_class_prof_id, ta_id = professor_class_ta_fixture
    #student_list, student_list_full = student_fixture
    response = client.get(f'/api/class/two/students')
    print(response.data)
    assert response.status_code == 404
    #assert 'message' in response.json == {"message":"Invalid input data"}
    
def test_get_class_students_class_no_id(client, professor_class_ta_fixture, student_fixture):
    """
    GIVEN GET /api/class/<int:class_id>/students
    WHEN the request does not contain a class_id
    THEN response should be 404 (Flask makes 404 if invalid data type in request)
    """
    #class1_id, class2_id, no_class_prof_id, two_class_prof_id, ta_id = professor_class_ta_fixture
    #student_list, student_list_full = student_fixture
    response = client.get(f'/api/class//students')
    print(response.data)
    assert response.status_code == 404
    #assert 'message' in response.json == {"message":"No class id provided"}
    

    
def test_add_class_success(client, student_fixture):
    """
    Given POST /api/add-class
    WHEN the request is valied
    THEN response should be 201 and message
    """
    student_list, student_list_full = student_fixture
    response = client.post('/api/add-class', 
            data = json.dumps({"class_name":"class 3", "professor_id":2, "class_code":"class3", "students":student_list}),
            headers = {'Content-Type': 'application/json'})
    
    print(response.data)
    assert response.status_code == 201
    assert 'message' in response.json == {'success': True, "message":"Class and students created successfully"}

def test_add_class_existing_class(client, student_fixture):
    """
    Given POST /api/add-class
    WHEN the request contains an existing class_code
    THEN response should be 409 and message
    """
    student_list, student_list_full = student_fixture
    response = client.post('/api/add-class',
                data = json.dumps({"class_name":"class 2", "professor_id":2, "class_code":"class2", "students":student_list}),
                headers = {'Content-Type': 'application/json'})
    print(response.data)
    assert response.status_code == 409
    assert 'message' in response.json == {"success": False, "message":"Class with that code already exists"}
    
    
def test_add_class_no_class_name(client, student_fixture):
    """
    Given POST /api/add-class
    WHEN the request is missing class_name
    THEN response should be 400 and message
    """
    student_list, student_list_full = student_fixture
    response = client.post('/api/add-class', 
            data = json.dumps({"professor_id":2, "class_code":"class4", "students":student_list}),
            headers = {'Content-Type': 'application/json'})
    
    print(response.data)
    assert response.status_code == 400
    assert 'message' in response.json == {"success": False, "message":"Missing required fields"}

def test_add_class_no_prof_id(client, student_fixture):
    """
    Given POST /api/add-class
    WHEN the request has no professor_id
    THEN response should be 400 and message
    """
    student_list, student_list_full = student_fixture
    response = client.post('/api/add-class', 
            data = json.dumps({"class_name":"class 5", "class_code":"class5", "students":student_list}),
            headers = {'Content-Type': 'application/json'})
    
    print(response.data)
    assert response.status_code == 400
    assert 'message' in response.json == {"success": False, "message":"Missing required fields"}
  
def test_add_class_no_class_code(client, student_fixture):
    """
    Given POST /api/add-class
    WHEN the request has no class_code
    THEN response should be 400 and message
    """
    student_list, student_list_full = student_fixture
    response = client.post('/api/add-class', 
            data = json.dumps({"class_name":"class 6", "professor_id":2, "students":student_list}),
            headers = {'Content-Type': 'application/json'})
    
    print(response.data)
    assert response.status_code == 400
    assert 'message' in response.json == {"success": False, "message":"Missing required fields"}

def test_add_class_type_error(client, student_fixture):
    """
    Given POST /api/add-class
    WHEN the request has invalid data types
    THEN response should be 400 and message
    """
    student_list, student_list_full = student_fixture
    response = client.post('/api/add-class', 
            data = json.dumps({"class_name":"class 7", "professor_id":"sdf", "class_code":7, "students":student_list}),
            headers = {'Content-Type': 'application/json'})
    
    print(response.data)
    assert response.status_code == 400
    assert 'message' in response.json == {"success": False, "message":"Invalid input data"}
    
def test_add_class_no_student_email(client, student_fixture, db_session):
    """
    Given POST /api/add-class
    WHEN the request is missing student email
    THEN response should be 400 and message
    """
    #student_list, student_list_full = student_fixture
    response = client.post('/api/add-class',
            data = json.dumps({"class_name":"class 8", "professor_id":2, "class_code":"class8", "students":[{"name":"student1"},{"name":"student2"}]}),
            headers = {'Content-Type': 'application/json'})
    print(response.data)
    assert response.status_code == 201
    assert 'message' in response.json == {"success": True, "message":"Class and students created successfully"}
    assert len(db_session.query(Student).filter(Student.email == None).all()) == 0
    
def test_add_class_some_correct_students(client, student_fixture, db_session):
    """
    Given POST /api/add-class
    WHEN the request has some correct data
    THEN response should be 400 and message
    """
    student_list, student_list_full = student_fixture
    response = client.post('/api/add-class',
            data = json.dumps({"class_name":"class 9", "professor_id":2, "class_code":"class9", "students":[student_list[0],{"name":"student2"},{"email":"student3@mail.com"}]}),
            headers = {'Content-Type': 'application/json'})
    print(response.data)
    assert response.status_code == 201
    assert 'message' in response.json == {"success": True, "message":"Class and students created successfully"}
    assert len(db_session.query(Student).filter(Student.email == None).all()) == 0
    
def test_add_class_existing_student(client, student_fixture):
    """
    Given POST /api/add-class
    WHEN the request contains an existing student
    THEN response should be 201 and message
    """
    student_list, student_list_full = student_fixture
    Student.post_student_email(student_list[0]['email'])
    response = client.post('/api/add-class',
            data = json.dumps({"class_name":"class 10", "professor_id":2, "class_code":"class10", "students":[student_list[0]]}),
            headers = {'Content-Type': 'application/json'})
    print(response.data)
    assert response.status_code == 201
    assert 'message' in response.json == {"success": True, "message":"Class and students created successfully"}

def test_add_class_some_existing_students(client, student_fixture):
    """
    Given POST /api/add-class
    WHEN the request contains some existing students
    THEN response should be 201 and message
    """
    student_list, student_list_full = student_fixture
    response = client.post('/api/add-class',
            data = json.dumps({"class_name":"class 11", "professor_id":2, "class_code":"class11", "students":student_list_full}),
            headers = {'Content-Type': 'application/json'})
    print(response.data)
    assert response.status_code == 201
    assert 'message' in response.json == {"success": True, "message":"Class and students created successfully"}
    
def test_add_class_existing_enrollment(client, student_fixture):
    """
    Given POST /api/add-class
    WHEN the request contains existing enrollments
    THEN response should be 201 and message
    """
    student_list, student_list_full = student_fixture
    response = client.post('/api/add-class',
            data = json.dumps({"class_name":"class 12", "professor_id":2, "class_code":"class12", "students":[student_list_full[3]]}),
            headers = {'Content-Type': 'application/json'})
    print(response.data)
    assert response.status_code == 201
    assert 'message' in response.json == {"success": True, "message":"Class and students created successfully"}
    
def test_add_class_some_existing_enrollments(client, student_fixture):
    """
    Given POST /api/add-class
    WHEN the request containst some existing enrollments
    THEN response should be 201 and message
    """
    student_list, student_list_full = student_fixture
    response = client.post('/api/add-class',
            data = json.dumps({"class_name":"class 13", "professor_id":2, "class_code":"class13", "students":student_list_full}),
            headers = {'Content-Type': 'application/json'})
    print(response.data)
    assert response.status_code == 201
    assert 'message' in response.json == {"success": True, "message":"Class and students created successfully"}
    
