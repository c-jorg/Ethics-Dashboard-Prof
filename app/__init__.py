from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_marshmallow import Marshmallow
from os import environ
import psycopg2
from .models.db import db, ma

# # Initialize SQLAlchemy
# db = SQLAlchemy()

# #Initialize Marshmallow
# ma = Marshmallow()


def create_app():
    app = Flask(__name__)

    # Load configuration
    from .config.database import SQLALCHEMY_DATABASE_URI, SQLALCHEMY_TRACK_MODIFICATIONS
    #app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
    app.config['SQLALCHEMY_DATABASE_URI'] = environ.get('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = SQLALCHEMY_TRACK_MODIFICATIONS

    # Enable CORS to allow your React frontend to communicate with the API
    CORS(app, resources={r"/api/*": {"origins": "*"}})  # Adjust origin to match your Vite dev server

    # Configure SQLAlchemy connection pool
    # app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
    #   'pool_size': 10,
    #   'max_overflow': 20,
    #   'pool_timeout': 30,
    #   'pool_recycle': 1800
    # }

    # Initialize extensions with app
    db.init_app(app)
    ma.init_app(app)

    # Register blueprints
    from .controllers.main import main_bp
    from .controllers.class_routes import class_bp
    from .controllers.student_routes import student_bp
    app.register_blueprint(main_bp)
    app.register_blueprint(class_bp)
    app.register_blueprint(student_bp)

    # try:
    #     conn = psycopg2.connect("postgresql://postgres:postgres@db:5432/postgres")
    #     print("Connected successfully!")
    # except Exception as e:
    #     print("Error connecting to database:", e)

    return app