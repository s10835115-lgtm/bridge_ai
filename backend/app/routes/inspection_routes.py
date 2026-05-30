from flask import Blueprint, request, current_app
from flask_jwt_extended import jwt_required
from ..models.models import Inspection, db
from ..utils.helpers import format_response, save_uploaded_file
from ..utils.image_converter import convert_to_standard_format
from ai.inference.predict import InferenceEngine
import os

inspection_bp = Blueprint('inspections', __name__)
ai_engine = InferenceEngine()

@inspection_bp.route('/upload', methods=['POST'])
@jwt_required()
def upload_image():
    if 'image' not in request.files:
        return format_response(False, "No image part", status_code=400)
    
    file = request.files['image']
    
    if file.filename == '':
        return format_response(False, "No selected file", status_code=400)
    
    filename = save_uploaded_file(file)
    
    if not filename:
        return format_response(False, "Invalid file type. Only JPG, PNG, JPEG are allowed.", status_code=400)
    
    # 1. Get full paths for AI processing
    original_upload_path = os.path.abspath(os.path.join(current_app.root_path, 'uploads', filename))
    processed_dir = os.path.abspath(os.path.join(current_app.root_path, 'uploads', 'processed'))
    
    # 1.1 Convert modern formats (AVIF/WebP) to standard PNG for AI
    upload_path = convert_to_standard_format(original_upload_path, os.path.dirname(original_upload_path))
    
    # 2. Run AI Inference Pipeline
    try:
        # Standardize on 'predict' method
        ai_results = ai_engine.predict(upload_path)
        
        # If the file was converted, we want to use the converted image's filename 
        # for database record to ensure Grad-CAM and display works perfectly
        if upload_path != original_upload_path:
            filename = os.path.basename(upload_path)
        
        # 3. Create initial inspection record
        inspection = Inspection(
            bridge_name="New Bridge Inspection",
            image_path=filename,
            severity=ai_results['severity'],
            confidence=ai_results['confidence'],
            risk_level=ai_results['risk_level'],
            total_length=ai_results['geometry']['total_length'],
            max_width=ai_results['geometry']['max_width'],
            density=ai_results['geometry']['density'],
            area_percentage=ai_results['geometry']['area_percentage'],
            status='Pending'
        )
        db.session.add(inspection)
        db.session.commit()

        # 4. Prepare response data
        response_data = {
            "inspection_id": inspection.id,
            "image_path": filename,
            "ai_analysis": ai_results
        }
        
        return format_response(True, "AI Analysis complete", data=response_data)
    except Exception as e:
        import traceback
        print(f"AI Error Traceback: {traceback.format_exc()}")
        return format_response(False, f"AI Processing Error: {str(e)}", status_code=500)

@inspection_bp.route('/inspections', methods=['POST'])
@jwt_required()
def create_inspection():
    data = request.get_json()
    
    required_fields = ['bridge_name', 'image_path', 'severity', 'confidence']
    if not all(field in data for field in required_fields):
        return format_response(False, "Missing required fields", status_code=400)
    
    inspection = Inspection(
        bridge_name=data['bridge_name'],
        image_path=data['image_path'],
        severity=data['severity'],
        confidence=data['confidence'],
        crack_width=data.get('crack_width'),
        crack_length=data.get('crack_length'),
        risk_level=data.get('risk_level'),
        status=data.get('status', 'Pending')
    )
    
    db.session.add(inspection)
    db.session.commit()
    
    return format_response(True, "Inspection created successfully", data=inspection.to_dict(), status_code=201)

@inspection_bp.route('/inspections', methods=['GET'])
@jwt_required()
def get_inspections():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    search = request.args.get('search', '')
    severity = request.args.get('severity', '')
    
    query = Inspection.query
    
    if search:
        query = query.filter(Inspection.bridge_name.ilike(f"%{search}%"))
    
    if severity:
        query = query.filter(Inspection.severity == severity)
        
    pagination = query.order_by(Inspection.created_at.desc()).paginate(page=page, per_page=per_page)
    
    return format_response(True, "Inspections retrieved successfully", data={
        "items": [item.to_dict() for item in pagination.items],
        "total": pagination.total,
        "pages": pagination.pages,
        "current_page": pagination.page
    })

@inspection_bp.route('/inspections/<int:id>', methods=['GET'])
@jwt_required()
def get_inspection(id):
    inspection = Inspection.query.get_or_404(id)
    return format_response(True, "Inspection retrieved successfully", data=inspection.to_dict())

@inspection_bp.route('/inspections/<int:id>', methods=['PUT'])
@jwt_required()
def update_inspection(id):
    inspection = Inspection.query.get_or_404(id)
    data = request.get_json()
    
    if 'bridge_name' in data:
        inspection.bridge_name = data['bridge_name']
    if 'status' in data:
        inspection.status = data['status']
    if 'crack_width' in data:
        inspection.crack_width = data['crack_width']
    if 'crack_length' in data:
        inspection.crack_length = data['crack_length']
        
    db.session.commit()
    return format_response(True, "Inspection updated successfully", data=inspection.to_dict())

@inspection_bp.route('/inspections/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_inspection(id):
    inspection = Inspection.query.get_or_404(id)
    db.session.delete(inspection)
    db.session.commit()
    return format_response(True, "Inspection deleted successfully")
