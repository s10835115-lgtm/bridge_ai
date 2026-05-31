from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
import bcrypt

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default='user') # admin, engineer, user
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    def check_password(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'role': self.role,
            'created_at': self.created_at.isoformat()
        }

class Inspection(db.Model):
    __tablename__ = 'inspections'
    
    id = db.Column(db.Integer, primary_key=True)
    bridge_name = db.Column(db.String(255), nullable=False)
    image_path = db.Column(db.String(255), nullable=False)
    severity = db.Column(db.String(20), nullable=False) # Safe, Moderate, Critical
    confidence = db.Column(db.Float, nullable=False)
    crack_width = db.Column(db.String(20))
    crack_length = db.Column(db.String(20))
    risk_level = db.Column(db.Integer) # 1-100
    # New geometry metrics
    total_length = db.Column(db.Float)
    max_width = db.Column(db.Float)
    density = db.Column(db.Float)
    area_percentage = db.Column(db.Float)
    
    status = db.Column(db.String(20), default='Pending') # Pending, Reviewed, Completed
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    reports = db.relationship('Report', backref='inspection', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'bridge_name': self.bridge_name,
            'image_path': self.image_path,
            'severity': self.severity,
            'crack_width': self.crack_width,
            'crack_length': self.crack_length,
            'risk_level': self.risk_level,
            'total_length': self.total_length,
            'max_width': self.max_width,
            'density': self.density,
            'area_percentage': self.area_percentage,
            'status': self.status,
            'created_at': self.created_at.isoformat()
        }

class Report(db.Model):
    __tablename__ = 'reports'
    
    id = db.Column(db.Integer, primary_key=True)
    inspection_id = db.Column(db.Integer, db.ForeignKey('inspections.id'), nullable=False)
    report_path = db.Column(db.String(255))
    summary = db.Column(db.Text)
    recommendation = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'inspection_id': self.inspection_id,
            'report_path': self.report_path,
            'summary': self.summary,
            'recommendation': self.recommendation,
            'created_at': self.created_at.isoformat()
        }
