
# #have to import every data type you want to use
# from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import psycopg2
# from app import db, app, ma
from ..__init__ import db, ma
from .answer import Answer, AnswerSchema
from .assignment import Assignment, AssignmentSchema
from .case_study import CaseStudy, CaseStudySchema
from .enrollment import Enrollment, EnrollmentSchema
from .feedback import Feedback, FeedbackSchema
from .grade import Grade, GradeSchema
from .form import Form, FormSchema
from .professor import Professor, ProfessorSchema
from .question import Question, QuestionSchema
from .school_class import Class, ClassSchema
from .student import Student, StudentSchema
from .submission import Submission, SubmissionSchema
from .ta import TA, TASchema
from .case_study_option import CaseStudyOption, CaseStudyOptionSchema

# Assignment.submissions = db.relationship("Submission", backref='assignment', lazy=True)
# Assignment.answers = db.relationship('Answer', backref='assingment', lazy=True)
# Assignment.feedbacks = db.relationship('Feedback', backref='assignment', lazy=True)

# CaseStudy.assignments = db.relationship('Assignment', backref='case_study', lazy=True)
# CaseStudy.questions = db.relationship('Question', backref='case_study', lazy=True)

# Professor.classes = db.relationship("Class", backref='prof', lazy=True)
# Professor.caseStudies = db.relationship("CaseStudy", backref='professor', lazy=True)

# Question.answers = db.relationship("Answer", backref='question', lazy=True)

# Class.caseStudies = db.relationship("CaseStudy", backref='class', lazy=True)
# Class.enrollements = db.relationship("Enrollment", backref='class', lazy=True)

# Student.assignments = db.relationship("Assignment", backref='student', lazy=True)
# Student.enrollments = db.relationship("Enrollment", backref='student', lazy=True)
# Student.submissions = db.relationship("Submission", backref='student', lazy=True)

# TA.caseStudies = db.relationship("CaseStudy", backref='ta', lazy=True)

__all__ = [
    'Answer',
    'Assignment',
    'CaseStudy',
    'Enrollment',
    'Feedback',
    'Form',
    'Professor',
    'Question',
    'Class',
    'Student',
    'Submission',
    'TA',
    'CaseStudyOption',
    'Grade',
    'AnswerSchema',
    'AssignmentSchema',
    'CaseStudySchema',
    'EnrollmentSchema',
    'FeedbackSchema',
    'FormSchema',
    'ProfessorSchema',
    'QuestionSchema',
    'ClassSchema',
    'StudentSchema',
    'SubmissionSchema',
    'TASchema',
    'CaseStudyOptionSchema',
    'GradeSchema'
]