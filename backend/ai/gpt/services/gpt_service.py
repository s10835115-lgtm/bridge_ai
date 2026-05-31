import os
import json
from openai import OpenAI
from dotenv import load_dotenv
from ai.gpt.prompts.maintenance_prompt import get_maintenance_prompt

load_dotenv()

class GPTService:
    def __init__(self):
        self.api_key = os.getenv('OPENAI_API_KEY')
        self.client = None
        if self.api_key:
            self.client = OpenAI(api_key=self.api_key)
        else:
            print("Warning: OPENAI_API_KEY not found in environment.")

    def generate_maintenance_report(self, bridge_name, severity, crack_width, crack_length, risk_level, geometry=None):
        """
        Calls OpenAI to generate a professional maintenance report based on AI findings.
        """
        if not self.client:
            # Fallback for testing/no API key
            return self._get_fallback_response(severity)

        try:
            prompt = get_maintenance_prompt(
                bridge_name, severity,
                crack_width, crack_length, risk_level,
                geometry=geometry
            )
            response = self.client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": "You are a Senior Civil Infrastructure AI Engineer."},
                    {"role": "user", "content": prompt}
                ],
                response_format={"type": "json_object"}
            )
            
            result = json.loads(response.choices[0].message.content)
            return result
        except Exception as e:
            print(f"GPT API Error: {str(e)}")
            return self._get_fallback_response(severity)

    def _get_fallback_response(self, severity):
        """
        Standardized engineering responses if GPT is unavailable.
        """
        if severity == "Critical":
            return {
                "maintenance_strategy": "Immediate Structural Reinforcement & Epoxy Injection",
                "urgency": "Immediate",
                "safety_warning": "CRITICAL: Significant structural compromise detected. Immediate load reduction recommended.",
                "inspection_priority": "Critical",
                "predictive_analysis": "High probability of crack propagation within 3-6 months due to thermal cycling.",
                "engineering_explanation": "The detected crack exceeds safety thresholds for primary support nodes."
            }
        elif severity == "Moderate":
            return {
                "maintenance_strategy": "Surface Sealing & Moisture Protection",
                "urgency": "Scheduled",
                "safety_warning": "Monitor closely for expansion. No immediate danger to structural integrity.",
                "inspection_priority": "Medium",
                "predictive_analysis": "Moderate risk of expansion if left untreated during winter cycles.",
                "engineering_explanation": "Secondary stress fracture detected. Likely caused by routine settlement."
            }
        else:
            return {
                "maintenance_strategy": "Routine Monitoring & Cleaning",
                "urgency": "Routine",
                "safety_warning": "Safe. Normal structural performance observed.",
                "inspection_priority": "Low",
                "predictive_analysis": "Negligible risk of propagation in the current assessment cycle.",
                "engineering_explanation": "Surface-level micro-cracks detected. No structural implications found."
            }
