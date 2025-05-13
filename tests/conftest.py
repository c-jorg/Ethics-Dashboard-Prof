import pytest 
import os
from app import create_app
from app.models.db import db, ma
import os
from app.models import *
from datetime import datetime

#make a temp memory db
os.environ['DATABASE_URL'] = 'sqlite:///:memory:'

#initializing stuff
@pytest.fixture(scope='session')
def app():
    app = create_app()
    app.config['TESTING'] = True
    with app.app_context():
        db.create_all()
        
        #setup forms
        Form.post_form('dilemma')
        Form.post_form('cons-stakeholders')
        Form.post_form('cons-util-bentham')
        Form.post_form('cons-util-mill')
        Form.post_form('categorical-imperatives')
        Form.post_form('critical-questions')
        Form.post_form('personal-sacrifices')
        Form.post_form('duties-versus-actions')
        Form.post_form('final-questions')
        Form.post_form('care-form')
        Form.post_form('intersect-form')
        Form.post_form('generations-form')
        Form.post_form('virtue-ethics')
        Form.post_form('life-path')
        Form.post_form('universal-principles')
        
        #give the test files the app session
        yield app 
        #drop the db when its done
        db.drop_all()
        
#this function return a testing app
@pytest.fixture(scope='session')
def client(app):
    return app.test_client()

# this returns a db.session
@pytest.fixture(scope='module')
def db_session(app):
    with app.app_context():
        db.drop_all()
        db.create_all()
        session = db.session()
        yield session
        db.session.rollback()
        db.drop_all()
        

@pytest.fixture(scope="module", autouse=True)
def professor_class_ta_fixture(client, db_session):
    print("Top of professir_clas_ta_fixture", flush=True)
    Professor.post_professor("no classes", "noclasses@mail.com", "pass")
    Professor.post_professor("2 classes", "2classes@mail.com", "pass")
    print("fixture made profs", flush=True)
    Class.post_class('class1',Professor.get_professor_id_by_professor_name('2 classes'),'class1')
    Class.post_class('class2',Professor.get_professor_id_by_professor_name('2 classes'),'class2')
    print("fixture made classes", flush=True)
    class1_id = Class.get_class_id_by_class_name('class1')
    class2_id = Class.get_class_id_by_class_name('class2')
    print(f"fixture got class ids {class1_id} {class2_id}", flush=True)
    no_class_prof_id = Professor.get_professor_id_by_professor_name('no classes')
    two_class_prof_id = Professor.get_professor_id_by_professor_name('2 classes')
    print(f"fixture got prof ids {no_class_prof_id} {two_class_prof_id}", flush=True)
    TA.post_ta('ta','ta@mail.com','pass')
    print("fixture made ta", flush=True)
    ta_id = TA.get_ta_by_email('ta@mail.com')
    print(f"fixtire got ta id {ta_id}", flush=True)
    return class1_id, class2_id, no_class_prof_id, two_class_prof_id, ta_id
    



    
