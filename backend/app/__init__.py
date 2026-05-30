import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from .config.config import config_by_name
from .models.models import db

migrate = Migrate()
jwt = JWTManager()

def create_app(config_name='development'):
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(config_by_name[config_name])
    
    # Initialize extensions
    CORS(app, resources={r"/*": {"origins": "*"}}) # Allow all routes for development
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    
    # Ensure upload folders exist
    upload_path = os.path.join(app.root_path, 'uploads')
    processed_path = os.path.join(upload_path, 'processed')
    reports_path = os.path.join(app.root_path, 'reports')
    
    for path in [upload_path, processed_path, reports_path]:
        if not os.path.exists(path):
            os.makedirs(path)

    # Register blueprints
    from .routes.auth_routes import auth_bp
    from .routes.inspection_routes import inspection_bp
    from .routes.dashboard_routes import dashboard_bp
    from .routes.report_routes import report_bp
    from .routes.ai_routes import ai_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(inspection_bp, url_prefix='/api')
    app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
    app.register_blueprint(report_bp, url_prefix='/api/reports')
    app.register_blueprint(ai_bp, url_prefix='/api')

    # Serve static files (uploads, processed heatmaps, and reports)
    from flask import send_from_directory
    
    @app.route('/uploads/<path:filename>')
    def serve_uploads(filename):
        return send_from_directory(os.path.join(app.root_path, 'uploads'), filename)

    @app.route('/reports/<path:filename>')
    def serve_reports(filename):
        return send_from_directory(os.path.join(app.root_path, 'reports'), filename)

    # Centralized Error Handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            "success": False,
            "message": "Resource not found",
            "data": None
        }), 404

    @app.errorhandler(500)
    def internal_server_error(error):
        return jsonify({
            "success": False,
            "message": "Internal server error",
            "data": str(error) if app.debug else None
        }), 500

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({
            "success": False,
            "message": "Token has expired",
            "data": None
        }), 401

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify({
            "success": False,
            "message": "Invalid token",
            "data": None
        }), 401

    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return jsonify({
            "success": False,
            "message": "Missing authorization token",
            "data": None
        }), 401

    return app
