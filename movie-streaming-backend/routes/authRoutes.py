from flask import Blueprint
from controllers import signup, login, forgotPassword, resetPassword, protected

auth_bp = Blueprint("auth", __name__)

auth_bp.route('/signup', methods=['POST'])(signup)
auth_bp.route('/login', methods=['POST'])(login)
auth_bp.route('/forgot-password', methods=["POST"])(forgotPassword)
auth_bp.route('/reset-password', methods=["POST", "OPTIONS"]) (resetPassword)
auth_bp.route('/home', methods=["GET"])(protected)