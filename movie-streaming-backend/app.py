from flask import Flask, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_pymongo import PyMongo
from flask_cors import CORS, cross_origin
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import datetime
from bson import ObjectId
from minio import Minio
import os
from dotenv import load_dotenv
import mimetypes


load_dotenv()

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])


app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
app.config['JWT_TOKEN_LOCATION'] = ['headers']
app.config["MONGO_URI"] = os.getenv('MONGO_URI')

db = PyMongo(app).db
jwt = JWTManager(app)

MINIO_URL = os.getenv("MINIO_URL")
MINIO_ACCESS_KEY = os.getenv("MINIO_ACCESS_KEY")
MINIO_SECRET_KEY = os.getenv("MINIO_SECRET_KEY")
MINIO_BUCKET_NAME = os.getenv("MINIO_BUCKET_NAME")

minio_client = Minio(
    MINIO_URL.replace("http://", "").replace("https://", ""),
    access_key=MINIO_ACCESS_KEY,
    secret_key=MINIO_SECRET_KEY,
    secure=False
)

if not minio_client.bucket_exists(MINIO_BUCKET_NAME):
    minio_client.make_bucket(MINIO_BUCKET_NAME)
IGNORE_FILES = ['.DS_Store', 'sample.mp4']
def upload_folder_to_minio(localfolder, minioprefix):
    for foldername, subfolders, filenames in os.walk(localfolder):
        for file in filenames:
            localpath = os.path.join(foldername, file)
            relativepath = os.path.relpath(localpath, localfolder)
            miniopath = os.path.join(minioprefix,relativepath).replace("\\","/")

            if file in IGNORE_FILES:
                print(f"Skipping file: {file}")
                continue

            content_type, _ = mimetypes.guess_type(localpath)
            if not content_type:
                content_type = 'application/octet-stream'

            try:
                minio_client.fput_object(MINIO_BUCKET_NAME, miniopath, localpath, content_type=content_type)
            except Exception as e:
                print(f"Error uploading {file} : {e}") 

@app.route("/uploadfolder", methods=["POST"])
def upload_video_folder():

    data = request.get_json()
    title = data.get('title')
    folder = data.get('folder')
    genre = data.get("genre")
    synopsis = data.get("synopsis")
    

    if not os.path.exists(folder):
        return jsonify({"error": "Folder not found"}), 400
    
    minio_path_prefix = f"{title}/"
    upload_folder_to_minio(folder, minio_path_prefix )

    videoUrl = f"http://192.168.101.5:9000/{MINIO_BUCKET_NAME}/{title}/master.m3u8"
    posterUrl = f"http://192.168.101.5:9000/{MINIO_BUCKET_NAME}/{title}/thumbnail/poster.jpg"
    

    db.movies.insert_one({
        "title": title,
        "hls_url": videoUrl,
        "poster_url": posterUrl,
        "resolution": ["1080p", "720p", "480p"],
        "genre": genre,
        "synopsis": synopsis,
        "uploaded_at": datetime.datetime.utcnow()
    })

    return jsonify({"message": "folder uploaded", "url": videoUrl, "posterUrl": posterUrl}) 




@app.route('/signup', methods=['POST', 'OPTIONS'])

def signup():
    data = request.get_json()
    username = data['username']
    email = data['email']
    password = data['password']

   
    user = db.users.find_one({"email": email})
    if user:
        return jsonify({"error": "User already exists."}), 400

   
    hash_password = generate_password_hash(password)

    db.users.insert_one({"username": username, "email": email, "password": hash_password})

    return jsonify({"message": "Signup Successful"}), 201


@app.route('/login', methods=['POST', 'OPTIONS'])
@cross_origin(supports_credentials=True, origins='http://localhost:5173')
def login():
      if request.method == 'OPTIONS':
          return '', 200
      
      data = request.get_json()
      email = data['email']
      password = data['password']
  
      user = db.users.find_one({"email": email})
      if user and check_password_hash(user['password'], password):
        user_id = str(user["_id"])
        access_token = create_access_token(identity=user_id, expires_delta=datetime.timedelta(hours=1))
        return jsonify({"message": "Login Successful", 'access_token': access_token}), 200
      else:
        return jsonify({"error": "Invalid Credentials"}), 401

@app.route('/home', methods=["GET", "OPTIONS"])
@cross_origin(supports_credentials=True, origins='http://localhost:5173')
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    user = db.users.find_one({"_id": ObjectId(current_user)})

    if not user:
        return jsonify({"msg": "user not found"}), 404
    
    return jsonify({
        "username": user.get('username'),
        "user_id": str(user["_id"]),
        "email": user.get("email")
    })

if __name__ == "__main__":
    app.run(debug=True)
