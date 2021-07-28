from decouple import config

CLIENT_ID = config("CLIENT_ID")
CLIENT_SECRET = config("CLIENT_SECRET")
REDIRECT_URI = "http://localhost:3000/login"
