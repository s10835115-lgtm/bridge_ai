import os
import uuid
from werkzeug.utils import secure_filename
from flask import jsonify, current_app

def format_response(success, message, data=None, status_code=200):
    return jsonify({
        "success": success,
        "message": message,
        "data": data
    }), status_code

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']

def save_uploaded_file(file):
    if not file or not allowed_file(file.filename):
        return None
    
    filename = secure_filename(file.filename)
    unique_filename = f"{uuid.uuid4().hex}_{filename}"
    
    upload_path = os.path.join(current_app.root_path, 'uploads')
    file_path = os.path.join(upload_path, unique_filename)
    
    file.save(file_path)
    return unique_filename
