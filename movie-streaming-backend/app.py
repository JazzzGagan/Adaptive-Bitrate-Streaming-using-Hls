from flask import Flask, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
from flask_socketio import SocketIO, emit
from ffmpeg_progress_yield import FfmpegProgress
from flask_pymongo import PyMongo
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import datetime, timedelta, timezone
from bson import ObjectId
from bson.errors import InvalidId
import os
from minio import Minio
from dotenv import load_dotenv
import mimetypes
import secrets
import hashlib
from werkzeug.utils import secure_filename
import mimetypes
import requests
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import pandas as pd
import time





load_dotenv()

app = Flask(__name__)

CORS(app, supports_credentials=True, origins=[
    "http://127.0.0.1:5173",
    "http://localhost:5175",
    "http://192.168.101.7:5175"
])

socketio = SocketIO(
    app,
    async_mode='eventlet',
    cors_allowed_origins=[
        "http://127.0.0.1:5173",
        "http://localhost:5175",
        "http://192.168.101.7:5175"
    ]
)




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

mongo = PyMongo(app)
db = mongo.db
jwt = JWTManager(app)

#TMDB
TMDB_API_KEY = os.getenv("TMDB_API_KEY")
TMDB_BASE_URL = os.getenv("TMDB_BASE_URL")



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


def upload_folder_to_minio(localfolder, minioprefix):
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

    videoUrl = f"http://127.0.0.1:9000/{MINIO_BUCKET_NAME}/{title}/master.m3u8"
   
    db.movies.insert_one({
        "title": title,
        "hls_url": videoUrl,
        "uploaded_at": datetime.now()
    })

    return jsonify({"message": "folder uploaded", "url": videoUrl})   

def ffmpeg_task(command, title, upload_path, hls_output_dir):
    ff = FfmpegProgress(command)
    for progress in ff.run_command_with_progress():
        socketio.emit('progress_update', {'progress': progress})
        print(progress)
        socketio.sleep(0)
    
    # Upload files to MinIO after conversion finishes
    minioprefix = f"{title}/"
    for foldername, subfolders, filenames in os.walk(hls_output_dir):
        for file in filenames:
            localpath = os.path.join(foldername, file)
            relativepath = os.path.relpath(localpath, hls_output_dir)
            miniopath = os.path.join(minioprefix, relativepath).replace("\\", "/")

            if file in IGNORE_FILES:
                continue

            content_type, _ = mimetypes.guess_type(localpath)
            if not content_type:
                content_type = 'application/octet-stream'

            try:
                minio_client.fput_object(MINIO_BUCKET_NAME, miniopath, localpath, content_type=content_type)
                os.remove(localpath)
            except Exception as e:
                print(f"Error uploading {file}: {e}")

    # Delete the uploaded source file after all done
    if os.path.exists(upload_path):
        os.remove(upload_path)
    
    try:
        videoUrl = f"http://192.168.101.2:9000/{MINIO_BUCKET_NAME}/{title}/master.m3u8"
   
        db.movies.insert_one({
        "title": title,
        "hls_url": videoUrl,
        "uploaded_at": datetime.now()
        })
    except Exception as e:
        print(f"failed to save to db {videoUrl}")
    
    socketio.emit('conversion_completed', {'message': f'Conversion for "{title}" completed.', 'url': videoUrl})

        



#convert into hls 
@app.route("/admin/convertvideo", methods=["POST"])
def convert_video():
    file = request.files['file']
    title = request.form.get('title', 'untitled')
   

    filename  = secure_filename(file.filename)
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    upload_dir = os.path.join(BASE_DIR, 'uploads')
    upload_path = os.path.join(upload_dir, filename)
    hls_output_dir = os.path.join(BASE_DIR, 'hls_output')
    
    
    file.save(upload_path)
    for quality in ['1080p', '720p', '360p']:
        os.makedirs(os.path.join(hls_output_dir, quality), exist_ok=True)

    socketio.emit('upload_complete', {'message': 'File upload complete', 'filename': filename})
   
    command = [
    "ffmpeg", "-i", upload_path,
    "-filter_complex", (
        "[0:v]split=3[v1][v2][v3]; "
        "[v1]scale=w=1920:h=1080[v1out]; "
        "[v2]scale=w=854:h=480[v2out]; "
        "[v3]scale=w=640:h=360[v3out]"
    ),
    "-map", "[v1out]", "-c:v:0", "libx264", "-b:v:0", "5000k", "-maxrate:v:0", "5350k", "-bufsize:v:0", "7500k",
    "-map", "[v2out]", "-c:v:1", "libx264", "-b:v:1", "1400k", "-maxrate:v:1", "1498k", "-bufsize:v:1", "2100k",
    "-map", "[v3out]", "-c:v:2", "libx264", "-b:v:2", "800k", "-maxrate:v:2", "856k", "-bufsize:v:2", "1200k",
    "-map", "a:0", "-c:a", "aac", "-b:a:0", "192k", "-ac", "2",
    "-map", "a:0", "-c:a", "aac", "-b:a:1", "128k", "-ac", "2",
    "-map", "a:0", "-c:a", "aac", "-b:a:2", "96k", "-ac", "2",
    "-f", "hls",
    "-var_stream_map", "v:0,a:0,name:1080p v:1,a:1,name:480p v:2,a:2,name:360p",
    "-hls_time", "10",
    "-hls_playlist_type", "vod",
    "-hls_flags", "independent_segments",
    "-hls_segment_type", "mpegts",
    "-hls_segment_filename", f"{hls_output_dir}/stream_%v/data%03d.ts",
    "-master_pl_name", "master.m3u8",
   f"{hls_output_dir}/stream_%v/playlist.m3u8"
]

    socketio.start_background_task(ffmpeg_task, command, title, upload_path, hls_output_dir)

    return jsonify({"message": "Conversion started", "url": None})

   
      
# Signup Route
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    print(data)
    username = data['username']
    email = data['email']
    password = data['password']
    dob = data['dob']
    avatar = data['avatar']

    

    user = db.users.find_one({"email": email})
    if user:
        return jsonify({"error": "User already exists."}), 400

    hash_password = generate_password_hash(password)

    db.users.insert_one({"username": username, "avatar": avatar, "email": email, "password": hash_password, "dob": dob} )

    return jsonify({"message": "Signup Successful"}), 201

# Login Route
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data['email']
    password = data['password']
    print(data)

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
    
#update user profile
@app.route('/updateprofile' , methods=["PUT"])
def updateProfile():
    data = request.get_json()
    
    userId = data["userId"]
    avatar = data['selectedAvatar']
    try:
        obj_id = ObjectId(userId)
        user = db.users.find_one({"_id": obj_id})
    except InvalidId:
        return jsonify({"message": "Invalid user ID"}), 400

    
    
    db.users.update_one({"_id": obj_id}, {"$set": {"avatar": avatar}})


    updated_user = db.users.find_one({"_id": obj_id})

    return jsonify({
        "username": updated_user.get("username"),
        "user_id": str(updated_user["_id"]),
        "email": updated_user.get("email"),
        "avatar": updated_user.get("avatar"),
        "message": "Profile updated successfully"
    })
#updateusername 
@app.route('/updateusername', methods=["PUT"])
def updateUsername():
    data = request.get_json()
    username = data['username']
    userId = data["userId"]

    try:
        obj_id  = ObjectId(userId)
        user = db.users.find_one({"_id": obj_id})
    except InvalidId:
        return jsonify({"message": "Invalid object id"}), 400
    
    db.users.update_one({"_id": obj_id}, {"$set" : {"username": username}})
    updated_user = db.users.find_one({"_id": obj_id})

    return jsonify({
        "username": updated_user.get("username"),
        "user_id": str(updated_user["_id"]),
        "email": updated_user.get("email"),
        "avatar": updated_user.get("avatar"),
        "message": "Username updated successfully"
    }), 200

#save videoplay progrees
@app.route("/saveprogress", methods=["POST"])
def saveProgress():
    data = request.get_json()
    userId = data['userId']
    movieTitle = data["movieTitle"]
    movieId = data["movieId"]
    progress = data["progress"]
    totalDuration = data["totalTime"]
    completed = data["completed"]

    print(data)


    try:
        obj_id  = ObjectId(userId)
        user = db.users.find_one({"_id": obj_id})
       
    except InvalidId:
        return jsonify({"message": "Invalid object id"}), 400
   
    if user :
        
        db.watch_progress.update_one(
            {"userId": userId, "movieId": movieId, },
            {
                "$set": {
                    "completed": completed,
                    "progress": progress,
                    "completed": completed,
                    "updatedAt": datetime.now(timezone.utc)
                    },
                "$setOnInsert": {
                    "movieTitle": movieTitle,
                    "totalDuration": totalDuration ,
                    "createdAt": datetime.now(timezone.utc)
                } 
            },
            upsert = True
        )
        return jsonify({"message": "Progess saved "}), 200
    else:
        return jsonify({"message": "User not found"}), 404

 #get watch progress   
@app.route("/watchprogress", methods=["GET"])
def getWatchProgress():
    userId = request.args.get("userId")
    try:
        obj_id = ObjectId(userId)
    except (InvalidId, TypeError):
        return jsonify({"error": "Invalid userId"}), 400
    
    progressData = list(db.watch_progress.find({"userId": userId}).sort("updatedAt", -1))

    results = [
        {
            "movieId" : item.get("movieId"),
            "movieTitle": item.get("movieTitle"),
            "progress": item.get("progress", 0),
            "totalDuration": item.get("totalDuration", 0),
            "completed": item.get("completed")
        }
        for item in progressData
    ]

    return(jsonify(results)), 200

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
        "email": user.get("email"),
        "avatar": user.get("avatar")
    })

def getUserWatchedIds(user_id):
    try:
       results = db.watch_progress.find(
           {"userId": user_id},
           {"movieId": 1, "_id":0}
       )

       movie_ids = [doc["movieId"] for doc in results]
       
       return movie_ids
       
    except Exception as e:
        return []
    
def getPopularMovieIds():
    url = f'{TMDB_BASE_URL}popular?api_key={TMDB_API_KEY}&language=en-US&page=1'
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()
        movie_ids = [ movie["id"] for movie in data["results"]]
        print("length movie" , len(movie_ids))
        return movie_ids
    else:
        return []

    
def getTmdbMetaData(watch_movie_ids):
    cached_movies = []
    
    for movieId in watch_movie_ids:
        movie = db.movie_cache.find_one({"id": movieId})
        if movie:
            cached_movies.append(movie)
        else:
            
            url = f'{TMDB_BASE_URL}{movieId}?api_key={TMDB_API_KEY}&language=en-US'
            res = requests.get(url )
            data = res.json()

            movie = {
                "id": data["id"],
                "title": data['title'],
                "overviews": data.get('overview', ''),
                "genres": " ".join([g['name'] for g in data.get('genres', [])])
            }
            db.movie_cache.insert_one(movie)
            cached_movies.append(movie)
    return cached_movies

def computeRecommendations(watched_metadata, candidate_metadata):
    

    def combineText(movie):
        return movie['overviews'] + " " + movie['genres']
    
    watched_Text = [combineText(movie) for movie in watched_metadata]
    candidate_Text = [combineText(movie) for movie in candidate_metadata]

    all_texts = watched_Text + candidate_Text

    vectorizer = TfidfVectorizer(stop_words="english")
    tfidf_matrix = vectorizer.fit_transform(all_texts)

    n_watched = len(watched_Text)
    watched_vectors = tfidf_matrix[:n_watched]
    candidate_vectors = tfidf_matrix[n_watched:]

    similarity_matrix = cosine_similarity(watched_vectors, candidate_vectors)

    df_similarity = pd.DataFrame(
        similarity_matrix,
        index = [m["title"] for m in watched_metadata],
        columns = [m["title"] for m in candidate_metadata]
    )

    # print("cosine similarity matrix: ")
    # print(df_similarity)
    
    sim_scores = similarity_matrix.max(axis = 1)
    top_n = 10
    top_indices = np.argsort(sim_scores)[::-1][:top_n]

    recommendations = [candidate_metadata[i] for i in top_indices]

    for i, idx  in enumerate(top_indices):
        recommendations[i]["similarity"] = float(sim_scores[idx])
    
    # print(recommendations)
   
    return recommendations

    

#recommend Movies
@app.route('/recommend', methods=["GET"])
def recommend_movies():
    start = time.time()
    user_id = request.args.get("userId")
    watch_movie_ids = getUserWatchedIds(user_id)

    watched_metadata = getTmdbMetaData(watch_movie_ids)
    candidate_metadata = getTmdbMetaData(getPopularMovieIds())

  
    recommendation = computeRecommendations(watched_metadata, candidate_metadata)

    end = time.time()
    print(f"Recommendation computed in {end - start:.2f} seconds")
    
    return jsonify(recommendation)

# Run the Flask Application
if __name__ == "__main__":
    socketio.run(app, port=5000, debug=True)

  

 
 