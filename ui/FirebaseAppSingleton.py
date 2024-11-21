import firebase_admin
from firebase_admin import credentials, initialize_app
import config
from utils.singleton_meta import SingletonMeta

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
                # Inicializar solo con credenciales
                cred = credentials.Certificate(config.FIREBASE_CREDENTIALS_PATH)
                self._app = firebase_admin.initialize_app(cred)
                self._initialized = True
            except ValueError:
                self._app = firebase_admin.get_app()