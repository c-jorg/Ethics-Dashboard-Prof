from .. import db, ma


class Student(db.Model):
    __tablename__ = "students"

    id = db.Column("student_id", db.Integer, primary_key=True)
    name = db.Column("name", db.String)
    email = db.Column("email", db.String)
    password = db.Column("password", db.String)
    guest = db.Column("guest", db.Boolean, default=False)
    consented = db.Column("consented", db.Boolean, default=False)

    # Relationship
    # assignments = db.relationship("Assignment", backref="student", lazy=True)
    # enrollments = db.relationship("Enrollment", backref="student", lazy=True)

    def __init__(self, name, email, password, guest=False, consented=False):
        self.name = name
        self.email = email
        self.password = password
        self.guest = guest
        self.consented = consented

    def json(self):
        return {'id': self.id, 'name': self.name, 'email': self.email, 'guest': self.guest, 'consented': self.consented}

    def __repr__(self):
        return f"Student({self.id}, {self.name}, {self.email}, {self.guest}, {self.consented})"

    def set_password(self, hashed_password):
        self.password = hashed_password
        db.session.commit()

    def get_password(self):
        return self.password

    def did_consent(self):
        return self.consented

    def set_consent(self, consented):
        self.consented = consented
        db.session.commit()

    def get_id(self):
        return self.id

    def set_email(self, email):
        self.email = email
        db.session.commit()

    @classmethod
    def delete_student(cls, student_id):
        db.session.query(cls).filter(cls.id == student_id).delete()
        db.session.commit()

    @classmethod
    def get_students(cls):
        return cls.query.all()

    @classmethod
    def get_student_by_email(cls, email):
        return cls.query.filter(cls.email == email).first()

    @classmethod
    def get_student_by_id(cls, id):
        return cls.query.filter(cls.id == id).first()

    @classmethod
    def post_student(cls, name, email, password, guest):
        student = cls(name, email, password, guest)
        db.session.add(student)
        db.session.commit()

    @classmethod
    def post_student_email(cls, email):
        student = cls(None, email, None, None)
        db.session.add(student)
        db.session.commit()

    @classmethod
    def update_student(cls, name, email, password, guest, consented):
        student = db.session.query(cls).filter(cls.email == email).first()
        student.name = name
        student.password = password
        student.guest = guest
        student.consented = consented
        db.session.commit()

    @classmethod
    def delete_student_by_id(cls, id):
        db.session.query(cls).filter(cls.id == id).delete()
        db.session.commit()

    @classmethod
    def delete_student_by_email(cls, email):
        db.session.query(cls).filter(cls.email == email).delete()
        db.session.commit()

    @classmethod
    def get_all_guests(cls):
        return db.session.query(cls).filter(cls.guest == True).all()

    @classmethod
    def delete_all_guests(cls):
        db.session.query(cls).filter(cls.guest == True).delete()
        db.session.commit()

    @classmethod
    def get_all_guest_ids(cls):
        guests = db.session.query(cls).filter(cls.guest == True).all()
        ids = [guest.id for guest in guests]
        return ids


class StudentSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Student
        session = db.session
        load_instance = True