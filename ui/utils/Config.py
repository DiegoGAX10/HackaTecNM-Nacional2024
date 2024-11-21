import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', os.path.abspath('ingebot_key.json'))
    BUCKET_NAME = os.getenv('BUCKET_NAME')