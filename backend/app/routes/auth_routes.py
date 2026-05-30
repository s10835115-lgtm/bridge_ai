from flask import Blueprint, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from ..models.models import User, db
from ..utils.helpers import format_response

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password') or not data.get('name'):
        return format_response(False, "Missing required fields", status_code=400)
    
    if User.query.filter_by(email=data['email']).first():
        return format_response(False, "User already exists", status_code=400)
    
    user = User(
        name=data['name'],
        email=data['email'],
        role=data.get('role', 'user')
    )
    user.set_password(data['password'])
    
    db.session.add(user)
    db.session.commit()
    
    return format_response(True, "User registered successfully", data=user.to_dict(), status_code=201)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return format_response(False, "Missing email or password", status_code=400)
    
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not user.check_password(data['password']):
        return format_response(False, "Invalid email or password", status_code=401)
    
    # Use string for identity to avoid serialization issues
    access_token = create_access_token(identity=str(user.id))
    
    return format_response(True, "Login successful", data={
        "token": access_token,
        "user": user.to_dict()
    })

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return format_response(False, "User not found", status_code=404)
    
    return format_response(True, "Profile retrieved successfully", data=user.to_dict())
