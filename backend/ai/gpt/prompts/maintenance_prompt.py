def get_maintenance_prompt(bridge_name, severity, crack_width, crack_length, risk_level, geometry=None):
    geometry_info = ""
    if geometry:
        geometry_info = f"""
    ### DETAILED GEOMETRY:
    - Total Crack Length: {geometry.get('total_length', 'N/A')} pixels
    - Max Estimated Width: {geometry.get('max_width', 'N/A')} pixels
    - Crack Density: {geometry.get('density', 'N/A')} clusters/unit
    - Surface Area Percentage: {geometry.get('area_percentage', 'N/A')}%
    """

    return f"""
    You are a Senior Civil Infrastructure AI Engineer specializing in structural health monitoring.
    Analyze the following crack detection data for the bridge: {bridge_name}

    ### DATA:
    - Detected Severity: {severity}
    - Measured Crack Width: {crack_width}
    - Measured Crack Length: {crack_length}
    - Calculated Risk Level: {risk_level}/100
    {geometry_info}

    ### TASK:
    1. Provide a professional engineering summary of the structural health, considering physical geometry and structural risk.
    2. Generate specific maintenance recommendations (e.g., Epoxy Injection, Carbon Fiber Reinforcement, or Replacement).
    3. Determine the urgency level (Immediate, Scheduled, Routine).
    4. Provide a critical safety warning if the geometry indicates deep fractures (high width/length).
    5. Predict the future risk of crack expansion over the next 6-12 months.

    ### OUTPUT FORMAT (JSON):
    {{
      "maintenance_strategy": "string",
      "urgency": "string",
      "safety_warning": "string",
      "inspection_priority": "string",
      "predictive_analysis": "string",
      "engineering_explanation": "string"
    }}
    """
