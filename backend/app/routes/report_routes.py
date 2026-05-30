from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from ..models.models import Report, db
from ..utils.helpers import format_response

report_bp = Blueprint('reports', __name__)

@report_bp.route('/', methods=['GET'])
@jwt_required()
def get_reports():
    reports = Report.query.order_by(Report.created_at.desc()).all()
    return format_response(True, "Reports retrieved successfully", data=[r.to_dict() for r in reports])

@report_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_report(id):
    report = Report.query.get_or_404(id)
    return format_response(True, "Report retrieved successfully", data=report.to_dict())

@report_bp.route('/', methods=['POST'])
@jwt_required()
def create_report():
    data = request.get_json()
    
    if not data or not data.get('inspection_id'):
        return format_response(False, "Missing inspection_id", status_code=400)
    
    report = Report(
        inspection_id=data['inspection_id'],
        summary=data.get('summary'),
        recommendation=data.get('recommendation'),
        report_path=data.get('report_path')
    )
    
    db.session.add(report)
    db.session.commit()
    
    return format_response(True, "Report created successfully", data=report.to_dict(), status_code=201)

@report_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_report(id):
    report = Report.query.get_or_404(id)
    db.session.delete(report)
    db.session.commit()
    return format_response(True, "Report deleted successfully")
