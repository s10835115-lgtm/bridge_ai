from flask import Blueprint
from flask_jwt_extended import jwt_required
from sqlalchemy import func
from ..models.models import Inspection, db
from ..utils.helpers import format_response

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_stats():
    total_inspections = Inspection.query.count()
    critical_cracks = Inspection.query.filter_by(severity='Critical').count()
    active_alerts = Inspection.query.filter(Inspection.status != 'Completed').count()
    
    return format_response(True, "Dashboard stats retrieved", data={
        "total_inspections": total_inspections,
        "critical_cracks": critical_cracks,
        "active_alerts": active_alerts
    })

@dashboard_bp.route('/activity', methods=['GET'])
@jwt_required()
def get_activity():
    # Recent inspections as activity
    recent = Inspection.query.order_by(Inspection.created_at.desc()).limit(10).all()
    return format_response(True, "Recent activity retrieved", data=[item.to_dict() for item in recent])

@dashboard_bp.route('/analytics', methods=['GET'])
@jwt_required()
def get_analytics():
    # Severity distribution
    severity_dist = db.session.query(
        Inspection.severity, func.count(Inspection.id)
    ).group_by(Inspection.severity).all()
    
    # Monthly inspections - MySQL specific func.date_format
    # Fallback to simple query if not MySQL or if it fails
    try:
        monthly_inspections = db.session.query(
            func.date_format(Inspection.created_at, '%Y-%m').label('month'),
            func.count(Inspection.id)
        ).group_by('month').order_by('month').all()
    except Exception:
        # Fallback for SQLite/others if needed during dev
        monthly_inspections = []
    
    return format_response(True, "Analytics data retrieved", data={
        "severity_distribution": [{"label": row[0], "value": row[1]} for row in severity_dist],
        "monthly_activity": [{"month": row[0], "count": row[1]} for row in monthly_inspections] if monthly_inspections else []
    })
