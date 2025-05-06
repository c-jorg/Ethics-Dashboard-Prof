import os
import secrets

# Project paths
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(PROJECT_ROOT, 'data', 'ethics.db')
DB_URI = f'sqlite:///{DB_PATH}'

# App configuration
FLASK_SECRET_KEY = os.getenv('FLASK_SECRET_KEY', secrets.token_hex(16))