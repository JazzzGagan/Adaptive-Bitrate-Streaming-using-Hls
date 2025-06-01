from flask import Flask, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
from flask_socketio import SocketIO, emit

from flask_pymongo import PyMongo
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import datetime, timedelta, timezone
from bson import ObjectId
import os
from minio import Minio
from dotenv import load_dotenv
import mimetypes
import secrets
import hashlib
import subprocess
from werkzeug.utils import secure_filename
import os
import mimetypes
import re



load_dotenv()

app = Flask(__name__)
socketio = SocketIO(
    app,
    async_mode='eventlet',
    cors_allowed_origins=[
        "http://127.0.0.1:5173",
        "http://172.16.3.135:5173"
    ]
)


# CORS Configuration - Supporting credentials and allowing specific origins
CORS(app, supports_credentials=True, origins=["http://127.0.0.1:5173", "http://172.16.3.135:5173"])

# Flask Configurations
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['SESSION_PERMANENT'] = False
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['SESSION_COOKIE_SECURE'] = False
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_NAME'] = 'admin_session'  
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
app.config['JWT_TOKEN_LOCATION'] = ['headers']
app.config["MONGO_URI"] = os.getenv('MONGO_URI')

# Initializing Database and JWT Manager
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
IGNORE_FILES = ['.DS_Store',] 


""" def upload_folder_to_minio(localfolder, minioprefix):
    for foldername, subfolders, filenames in os.walk(localfolder):
        for file in filenames:
            localpath = os.path.join(foldername, file)
            relativepath = os.path.relpath(localpath, localfolder)
            miniopath = os.path.join(minioprefix, relativepath).replace("\\", "/")

            if file in IGNORE_FILES:
                print(f"Skipping file: {file}")
                continue

            content_type, _ = mimetypes.guess_type(localpath)
            if not content_type:
                content_type = 'application/octet-stream'

            try:
                minio_client.fput_object(MINIO_BUCKET_NAME, miniopath, localpath, content_type=content_type)
                
                # Permanently delete the file after successful upload``
                os.remove(localpath)
                print(f"Deleted local file: {localpath}")

            except Exception as e:
                print(f"Error uploading {file}: {e}")


@app.route("/uploadfolder", methods=["POST"])
def upload_video_folder():
    data = request.get_json()
    title = data.get('title')
    folder = data.get('folder')
    
    if not os.path.exists(folder):
        return jsonify({"error": "Folder not found"}), 400
    
    minio_path_prefix = f"{title}/"
    upload_folder_to_minio(folder, minio_path_prefix )

    videoUrl = f"http://192.168.101.3:64176/{MINIO_BUCKET_NAME}/{title}/master.m3u8"
   
    

    db.movies.insert_one({
        "title": title,
        "hls_url": videoUrl,
        "uploaded_at": datetime.datetime.utcnow()
    })

    return jsonify({"message": "folder uploaded", "url": videoUrl})   """
 

#convert into hls 
@app.route("/admin/convertvideo", methods=["POST"])
def convert_video():
    file = request.files['file']
    title = request.form.get('title', 'untitled')

    filename  = secure_filename(file.filename)
    upload_path = f"./uploads/{filename}"
    hls_output_dir = f"./hls_output"
    minioprefix = f"{title}/"

    os.makedirs(hls_output_dir, exist_ok=True)
    file.save(upload_path)

   
  

    command = [
        "ffmpeg", "-i", upload_path,
        "-filter_complex", "[0:v]split=3[v1][v2][v3];" +
                           "[v1]scale=w=1920:h=1080[v1out];" +
                           "[v2]scale=w=1280:h=720[v2out];" +
                           "[v3]scale=w=640:h=360[v3out]",
        "-map", "[v1out]", "-c:v:0", "libx264", "-b:v:0", "5000k",
        "-map", "[v2out]", "-c:v:1", "libx264", "-b:v:1", "3000k",
        "-map", "[v3out]", "-c:v:2", "libx264", "-b:v:2", "1000k",
        "-f", "hls",
        "-var_stream_map", "v:0,name:1080p v:1,name:720p v:2,name:360p",
        "-master_pl_name", "master.m3u8",
        "-hls_time", "4", "-hls_list_size", "0", "-hls_segment_filename",
        f"{hls_output_dir}/%v/seg_%03d.ts", f"{hls_output_dir}/%v/prog.m3u8"
    ]
    
    process = subprocess.Popen(command, stderr=subprocess.PIPE, universal_newlines=True)
    duration = None

    for line in process.stderr:
        if duration is None:
            match = re.search(r'Duration: (\d+):(\d+):(\d+\.\d+)', line)
            if match:
                h, m, s = map(float, match.groups())
                duration = h * 3600 + m * 60 + s

        match = re.search(r'time=(\d+):(\d+):(\d+\.\d+)', line)
        if match and duration:
            h, m, s = map(float, match.groups())
            current_time = h * 3600 + m * 60 + s
            percent = int((current_time / duration) * 100)
            socketio.emit('convert-progress', {'progress': percent})

   

    for foldername, subfolders, filenames in os.walk(hls_output_dir):
        for file in filenames:
            localpath = os.path.join(foldername, file)
            relativepath = os.path.relpath(localpath, hls_output_dir)
            miniopath = os.path.join(minioprefix, relativepath).replace("\\", "/")

            if file in IGNORE_FILES:
                print(f"Skipping file: {file}")
                continue

            content_type, _ = mimetypes.guess_type(localpath)
            if not content_type:
                content_type = 'application/octet-stream'

            try:
                minio_client.fput_object(MINIO_BUCKET_NAME, miniopath, localpath, content_type=content_type)
                
                # Permanently delete the file after successful upload``
                os.remove(localpath)
                print(f"Deleted local file: {localpath}")

            except Exception as e:
                print(f"Error uploading {file}: {e}")

    os.remove(upload_path)
    videoUrl = f"http://192.168.101.3:9000/{MINIO_BUCKET_NAME}/{title}/master.m3u8"
   
    db.movies.insert_one({
        "title": title,
        "hls_url": videoUrl,
        "uploaded_at": datetime.now()
    })

    return jsonify({"message": "folder uploaded", "url": videoUrl}) 

   
      
# Signup Route
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data['username']
    email = data['email']
    password = data['password']
    dob = data['dob']

    

    user = db.users.find_one({"email": email})
    if user:
        return jsonify({"error": "User already exists."}), 400

    hash_password = generate_password_hash(password)

    db.users.insert_one({"username": username, "email": email, "password": hash_password, "dob": dob} )

    return jsonify({"message": "Signup Successful"}), 201

# Login Route
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data['email']
    password = data['password']

    user = db.users.find_one({"email": email})
    if user and check_password_hash(user['password'], password):
        user_id = str(user["_id"])
        access_token = create_access_token(identity=user_id, expires_delta=timedelta(days=30))
        return jsonify({"message": "Login Successful", 'access_token': access_token}), 200
    else:
        return jsonify({"error": "Invalid Credentials"}), 401

@app.route('/admin/login', methods=["POST"])
def admin_login():
    data = request.get_json()
    username = data['username']
    password = data['password']

    if username == "admin" and password == "secret@123":
       
        session['admin_logged_in'] = True
     
        print("Session after login:", session) 
     
        return jsonify({"message": "Login Sucessfully"}), 200
    return jsonify({'message': 'Invalid credentials'}), 401

@app.route("/admin/check-auth", methods=["GET"])
def admin_dashboard():
    
    if not session.get('admin_logged_in'):
        return jsonify({"error": "Unauthorized"}), 401
    return jsonify({"message": "Welcome admin!"}), 200


@app.route('/admin/logout', methods=["POST"])
def admin_logout():
    print("Before clear:", dict(session))
    session.clear()
    print("After clear:", dict(session))

    response = jsonify({"message": "Logged out successfully"})
    app.session_interface.save_session(app, session, response)
    return response


# Forgot Password Route
@app.route('/forgot-password', methods=["POST"])
def forgotPassword():
    data = request.get_json()
    email = data["email"]

    user = db.users.find_one({"email": email})
    
    if user:
        resetToken = secrets.token_urlsafe(32)
        hashToken = hashlib.sha256(resetToken.encode()).hexdigest()
        expiry_time = datetime.now(timezone.utc) + timedelta(minutes=15)
        db.reset_token.insert_one({"email": email,
                                   "reset_token": hashToken,
                                   "expires_at": expiry_time})
        reset_link = f"/reset-password/{resetToken}"

        return jsonify({"message": reset_link })
    
    else:
        return jsonify({"error": "User not found"}), 404

# Reset Password Route
@app.route('/reset-password', methods=["POST", "OPTIONS"]) 
def resetPassword():
    try:
        if request.method == "OPTIONS":
            return '', 200
        data = request.get_json()
        token = data["token"]
        newPassword = data["newPassword"]

        hashToken = hashlib.sha256(token.encode()).hexdigest()
        resetTokenRecord = db.reset_token.find_one({"reset_token": hashToken})

        if not resetTokenRecord:
            return jsonify({"error": "Invalid or expired token"}), 400

        expiration_time = resetTokenRecord["expires_at"]
        if expiration_time.tzinfo is None:
            expiration_time = expiration_time.replace(tzinfo=timezone.utc)

        current_time = datetime.now(timezone.utc)

        if current_time > expiration_time:
            return jsonify({"message": "The token has expired"}), 400

        email = resetTokenRecord["email"]
        user = db.users.find_one({"email": email})
        if not user:
            return jsonify({"error": "User not found"}), 404

        hashPassword = generate_password_hash(newPassword)
        db.users.update_one({"email": email}, {"$set": {"password": hashPassword}})
        db.reset_token.delete_one({"reset_token": hashToken})

        return jsonify({"message": "Password has been reset successfully"}), 200
    except Exception as e:
        print(e)
        return jsonify({"message":"error occured"}), 400
    




# Protected Route (Requires JWT Authentication)
@app.route('/home', methods=["GET"])
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



@socketio.on('connect')
def handle_connect():
    print('Client connected')
   
@socketio.on('message')
def handle_my_custom_event(data):
    print(data)
    emit('foo_response', {'message': 'got it'})

@socketio.on('create-something')
def handle_create_something(data):
    print('🛠️ Received create-something with:', data)

    # Example: process the data (e.g., store in DB, etc.)
    # ...

    # Acknowledge back to the client
    return {'status': 'ok', 'message': 'Created successfully'}

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')


# Run the Flask Application
if __name__ == "__main__":
    socketio.run(app, port=5000, debug=True)
    print(socketio.async_mode)

 
 