import os

# Database configuration
DB_USER = os.environ.get('DB_USER', 'ethics_dashboard')
DB_PASSWORD = os.environ.get('DB_PASSWORD', 'Letmein1!')
DB_HOST = os.environ.get('DB_HOST', 'db')
# DB_HOST = os.environ.get('DB_HOST', 'postgres-example')
DB_PORT = os.environ.get('DB_PORT', '5432') # or 2022?
DB_NAME = os.environ.get('DB_NAME', 'ethics_dashboard')

# SQLAlchemy database URI
#postgresql://postgres:postgres@db:5432/postgres
SQLALCHEMY_DATABASE_URI = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
# print(SQLALCHEMY_DATABASE_URI)
SQLALCHEMY_TRACK_MODIFICATIONS = False
