from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from ..models.models import Inspection, Report, db
from ..utils.helpers import format_response
from ai.gpt.services.gpt_service import GPTService
from ai.gpt.reports.generate_report import AIReportGenerator
import os

ai_bp = Blueprint('ai', __name__)
gpt_service = GPTService()

@ai_bp.route('/ai/recommendation/<int:inspection_id>', methods=['GET'])
@jwt_required()
def get_ai_recommendation(inspection_id):
    inspection = Inspection.query.get_or_404(inspection_id)
    
    # Generate GPT recommendations
    ai_results = gpt_service.generate_maintenance_report(
        bridge_name=inspection.bridge_name,
        severity=inspection.severity,
        crack_width=inspection.crack_width,
        crack_length=inspection.crack_length,
        risk_level=inspection.risk_level,
        geometry={
            "total_length": inspection.total_length,
            "max_width": inspection.max_width,
            "density": inspection.density,
            "area_percentage": inspection.area_percentage
        }
    )
    
    return format_response(True, "AI recommendation generated", data=ai_results)

@ai_bp.route('/ai/generate-report/<int:inspection_id>', methods=['POST'])
@jwt_required()
def generate_ai_report(inspection_id):
    inspection = Inspection.query.get_or_404(inspection_id)
    
    # 1. Get GPT Analysis
    ai_analysis = gpt_service.generate_maintenance_report(
        bridge_name=inspection.bridge_name,
        severity=inspection.severity,
        crack_width=inspection.crack_width,
        crack_length=inspection.crack_length,
        risk_level=inspection.risk_level,
        geometry={
            "total_length": inspection.total_length,
            "max_width": inspection.max_width,
            "density": inspection.density,
            "area_percentage": inspection.area_percentage
        }
    )
    
    # 2. Generate PDF
    report_dir = os.path.join(os.path.dirname(__file__), '../reports')
    generator = AIReportGenerator(report_dir)
    
    report_data = {
        "inspection_id": f"INS-{inspection.id}",
        "bridge_name": inspection.bridge_name,
        "severity": inspection.severity,
        "crack_width": inspection.crack_width,
        "crack_length": inspection.crack_length,
        "risk_level": inspection.risk_level,
        "total_length": inspection.total_length,
        "max_width": inspection.max_width,
        "density": inspection.density,
        "area_percentage": inspection.area_percentage,
        **ai_analysis
    }
    
    pdf_filename = generator.generate(report_data)
    
    # 3. Save to database
    report = Report(
        inspection_id=inspection.id,
        report_path=f"reports/{pdf_filename}",
        summary=ai_analysis['engineering_explanation'],
        recommendation=ai_analysis['maintenance_strategy']
    )
    
    db.session.add(report)
    db.session.commit()
    
    return format_response(True, "PDF Report generated and saved", data={
        "report_id": report.id,
        "pdf_url": report.report_path,
        "analysis": ai_analysis
    })
