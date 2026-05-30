import os
from fpdf import FPDF
from datetime import datetime

class AIReportGenerator:
    def __init__(self, output_dir):
        self.output_dir = output_dir
        if not os.path.exists(self.output_dir):
            os.makedirs(self.output_dir)

    def generate(self, data):
        """
        Generates a professional PDF engineering report.
        """
        pdf = FPDF()
        pdf.add_page()
        
        # Header
        pdf.set_font("Arial", 'B', 20)
        pdf.set_text_color(11, 17, 32) # #0B1120
        pdf.cell(0, 20, "BridgeAI Inspection Report", ln=True, align='C')
        
        pdf.set_font("Arial", '', 10)
        pdf.set_text_color(100, 116, 139)
        pdf.cell(0, 10, f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} UTC", ln=True, align='C')
        pdf.ln(10)

        # Inspection Details
        pdf.set_font("Arial", 'B', 14)
        pdf.set_text_color(34, 211, 238) # Cyan
        pdf.cell(0, 10, "1. Inspection Summary", ln=True)
        pdf.set_font("Arial", '', 11)
        pdf.set_text_color(0, 0, 0)
        
        details = [
            ("Bridge Name", data.get('bridge_name', 'Unknown')),
            ("Inspection ID", data.get('inspection_id', 'N/A')),
            ("AI Severity", data.get('severity', 'N/A')),
            ("Confidence Score", f"{data.get('confidence', 0)}%"),
            ("Risk Level", f"{data.get('risk_level', 0)}/100"),
            ("Total Crack Length", f"{data.get('total_length', 'N/A')} px"),
            ("Max Crack Width", f"{data.get('max_width', 'N/A')} px"),
            ("Crack Density", f"{data.get('density', 'N/A')} clusters"),
            ("Area Percentage", f"{data.get('area_percentage', 'N/A')}%")
        ]
        
        for label, val in details:
            pdf.set_font("Arial", 'B', 10)
            pdf.cell(40, 8, f"{label}:", 0)
            pdf.set_font("Arial", '', 10)
            pdf.cell(0, 8, str(val), 1)
            pdf.ln(8)
        
        pdf.ln(10)

        # GPT Recommendations
        pdf.set_font("Arial", 'B', 14)
        pdf.set_text_color(34, 211, 238)
        pdf.cell(0, 10, "2. AI Engineering Recommendations", ln=True)
        
        pdf.set_font("Arial", 'B', 10)
        pdf.set_text_color(0, 0, 0)
        pdf.cell(0, 8, "Maintenance Strategy:", ln=True)
        pdf.set_font("Arial", '', 10)
        pdf.multi_cell(0, 8, data.get('maintenance_strategy', 'N/A'))
        
        pdf.ln(4)
        pdf.set_font("Arial", 'B', 10)
        pdf.cell(0, 8, "Predictive Analysis:", ln=True)
        pdf.set_font("Arial", '', 10)
        pdf.multi_cell(0, 8, data.get('predictive_analysis', 'N/A'))

        pdf.ln(4)
        pdf.set_font("Arial", 'B', 10)
        pdf.set_text_color(239, 68, 68) # Red
        pdf.cell(0, 8, "Safety Warning:", ln=True)
        pdf.set_font("Arial", '', 10)
        pdf.multi_cell(0, 8, data.get('safety_warning', 'N/A'))

        # Footer
        pdf.set_y(-30)
        pdf.set_font("Arial", 'I', 8)
        pdf.set_text_color(150, 150, 150)
        pdf.cell(0, 10, "Disclaimer: This report is AI-generated for engineering assistance and should be verified by a licensed professional.", 0, 0, 'C')

        filename = f"report_{data.get('inspection_id')}.pdf"
        filepath = os.path.join(self.output_dir, filename)
        pdf.output(filepath)
        
        return filename
