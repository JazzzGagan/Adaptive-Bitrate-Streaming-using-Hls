from flask import Flask
from flask_cors import CORS
from flask_pymongo import PyMongo
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os

from .routes.auth_routes import auth_bp
from .routes.video_routes import video_bp





load_dotenv()
app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http:localhost:5173"])
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
app.config['JWT_TOKEN_LOCATION'] = ['headers']
app.config["MONGO_URI"] = os.getenv('MONGO_URI')

mongo = PyMongo(app)
app.db = mongo.db

app.register_blueprint(auth_bp)
app.register_blueprint(video_bp)

if __name__ == "main":
    app.run(debug=True, port=5000)

 
