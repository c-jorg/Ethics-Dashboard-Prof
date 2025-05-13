import json
from app.models import *
import pytest 
from datetime import datetime

@pytest.fixture(scope="module")
def professor_class_ta_fixture(client, db_session):
    Professor.post_professor("no classes", "noclasses@mail.com", "pass")
    Professor.post_professor("2 classes", "2classes@mail.com", "pass")
    Class.post_class('class1',Professor.get_professor_id_by_professor_name('2 classes'),'class1')
    Class.post_class('class2',Professor.get_professor_id_by_professor_name('2 classes'),'class2')
    class1_id = Class.get_class_id_by_class_name('class1')
    class2_id = Class.get_class_id_by_class_name('class2')
    no_class_prof_id = Professor.get_professor_id_by_professor_name('no classes')
    two_class_prof_id = Professor.get_professor_id_by_professor_name('2 classes')
    TA.post_ta('ta','ta@mail.com','pass')
    yield class1_id, class2_id, no_class_prof_id, two_class_prof_id
    #db_session.rollback()

@pytest.fixture(scope="module")
def case_study_fixture(client, db_session, professor_class_ta_fixture):
    class1_id, class2_id, no_class_prof_id, two_class_prof_id = professor_class_ta_fixture
    CaseStudy.post_case_study(two_class_prof_id, class2_id, "assignment test", datetime.now())
    case_study_id = CaseStudy.get_case_study_by_title("assignment test").id
    CaseStudyOption.post_case_study_option(case_study_id, "Option 1", "Option 1 description")
    CaseStudyOption.post_case_study_option(case_study_id, "Option 2", "Option 2 description")
    CaseStudyOption.post_case_study_option(case_study_id, "Option 3", "Option 3 description")
    options = CaseStudyOption.get_case_study_options_by_case_study_id(case_study_id)
    case_study_option_ids = [option.id for option in options]
    yield case_study_id, case_study_option_ids
    #db_session.rollback()

def test_add_case_study_success_no_TA(client, professor_class_ta_fixture):
    """
    GIVEN POST /api/case-study
    WHEN THE request is valid
    THEN response should be 201 and message
    """
    class1_id, class2_id, no_class_prof_id, two_class_prof_id, ta_id = professor_class_ta_fixture
    data = {"prof_id": two_class_prof_id, "ta_id":None, "class_id": class1_id, "title": "assignment 1"}
    response = client.post('/api/case-study', json=data, headers={"Content-Type": "application/json"})
    assert response.status_code == 201
    assert "message" in response.json == {"message":"Case study created successfully"}
    assert "TA" in response.json == {"TA": "No TA assigned"}
    
def test_add_case_study_success_with_TA(client, professor_class_ta_fixture):
    """
    GIVEN POST /api/case-study
    WHEN THE request is valid
    THEN response should be 201 and message
    """
    class1_id, class2_id, no_class_prof_id, two_class_prof_id, ta_id = professor_class_ta_fixture
    data = {"prof_id": two_class_prof_id, "ta_id":ta_id, "class_id": class1_id, "title": "assignment 2"}
    response = client.post('/api/case-study', json=data, headers={"Content-Type": "application/json"})
    assert response.status_code == 201
    assert "message" in response.json == {"message":"Case study created successfully"}
    assert "TA" in response.json == {"TA": "TA assigned"}
    
def test_add_case_study_class_not_found(client, professor_class_ta_fixture):
    """
    GIVEN POST /api/case-study
    WHEN THE request contains a class_id that does not exist
    THEN response should be 404 and message
    """
    class1_id, class2_id, no_class_prof_id, two_class_prof_id, ta_id = professor_class_ta_fixture
    data = {"prof_id": two_class_prof_id, "ta_id":None, "class_id": 645564, "title": "assignment 3"}
    response = client.post('/api/case-study', json=data, headers={"Content-Type": "application/json"})
    assert response.status_code == 404
    assert "message" in response.json == {"message":"Class not found"}
    
def test_add_case_study_professor_not_found(client, professor_class_ta_fixture):
    """
    GIVEN POST /api/case-study
    WHEN THE request contains a professor_id that does not exist
    THEN response should be 404 and message
    """
    class1_id, class2_id, no_class_prof_id, two_class_prof_id, ta_id = professor_class_ta_fixture
    data = {"prof_id": 6545643, "ta_id":None, "class_id": class1_id, "title": "assignment 4"}
    response = client.post('/api/case-study', json=data, headers={"Content-Type": "application/json"})
    assert response.status_code == 404
    assert "message" in response.json == {"message":"Professor not found"}
    
def test_add_case_study_ta_not_found(client, professor_class_ta_fixture):
    """
    GIVEN POST /api/case-study
    WHEN THE request contains a ta_id that does not exist
    THEN response should be 404 and message
    """
    class1_id, class2_id, no_class_prof_id, two_class_prof_id, ta_id = professor_class_ta_fixture
    data = {"prof_id": two_class_prof_id, "ta_id":546432, "class_id": class1_id, "title": "assignment 5"}
    response = client.post('/api/case-study', json=data, headers={"Content-Type": "application/json"})
    assert response.status_code == 404
    assert "message" in response.json == {"message":"TA not found"}
    
def test_add_case_study_invalid_data(client, professor_class_ta_fixture):
    """
    GIVEN POST /api/case-study
    WHEN the request contains invalid data type
    THEN response should be 400 and message
    """
    class1_id, class2_id, no_class_prof_id, two_class_prof_id, ta_id = professor_class_ta_fixture
    data = {"prof_id": two_class_prof_id, "ta_id":'546432', "class_id": class1_id, "title": 4}
    response = client.post('/api/case-study', json=data, headers={"Content-Type": "application/json"})
    assert response.status_code == 400
    assert "message" in response.json == {"message":"Invalid input data"}
    
def test_add_case_study_missing_fields(client, professor_class_ta_fixture):
    """
    GIVEN POST /api/case-study
    WHEN the request json is missing fields
    THEN response should be 400 and message
    """
    class1_id, class2_id, no_class_prof_id, two_class_prof_id, ta_id = professor_class_ta_fixture
    data = {"ta_id":546432, "class_id": class1_id}
    response = client.post('/api/case-study', json=data, headers={"Content-Type": "application/json"})
    assert response.status_code == 400
    assert "message" in response.json == {"message":"Missing required fields"}
    
def test_get_case_studies_success(client, professor_class_ta_fixture, case_study_fixture):
    """
    GIVEN GET /api/case-study?class_id
    WHEN the request contains a valid class_id
    THEN response should be 200 and return list of case study info
    """
    class1_id, class2_id, no_class_prof_id, two_class_prof_id, ta_id = professor_class_ta_fixture
    case_study_id, case_study_option_ids = case_study_fixture