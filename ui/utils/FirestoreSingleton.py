from firebase_admin import firestore
from FirebaseAppSingleton import FirebaseAppSingleton
from SingletonMeta import SingletonMeta


class FirestoreSingleton(metaclass=SingletonMeta):
    _instance = None
    _client = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(FirestoreSingleton, cls).__new__(cls)
        return cls._instance

    @property
    def client(self):
        if self._client is None:
            FirebaseAppSingleton().app
            self._client = firestore.client()
        return self._client