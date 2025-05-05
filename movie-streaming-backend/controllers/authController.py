from flask import Flask, request, jsonify, current_app
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import datetime, timedelta, timezone
from bson import ObjectId
import secrets, hashlib


def signup():
    db = current_app.db
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

# Login Route

def login():
   
    data = request.get_json()
    email = data['email']
    password = data['password']

    user = db.users.find_one({"email": email})
    if user and check_password_hash(user['password'], password):
        user_id = str(user["_id"])
        access_token = create_access_token(identity=user_id, expires_delta=timedelta(minutes=15))
        return jsonify({"message": "Login Successful", 'access_token': access_token}), 200
    else:
        return jsonify({"error": "Invalid Credentials"}), 401

# Forgot Password Route

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

