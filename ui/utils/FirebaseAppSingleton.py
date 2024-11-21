import firebase_admin
from firebase_admin import credentials, initialize_app
from utils.Config import Config
from utils.SingletonMeta import SingletonMeta


class FirebaseAppSingleton(metaclass=SingletonMeta):
    _instance = None
    _initialized = False
    _app = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(FirebaseAppSingleton, cls).__new__(cls)
        return cls._instance

    @property
    def app(self):
        if not self._initialized:
            self._initialize()
        return self._app

    def _initialize(self):
        if not self._initialized:
            try:
                cred = credentials.Certificate(Config.SECRET_KEY)
                self._app = firebase_admin.initialize_app(cred, {
                    'storageBucket': Config.BUCKET_NAME
                })
                self._initialized = True
            except ValueError:
                self._app =  firebase_admin.get_app()