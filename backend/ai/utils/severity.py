def classify_severity(confidence, contour_count, density=None):
    """
    Logic to determine severity based on confidence and structural features.
    """
    # Normalize confidence to 0-100 scale if it's 0-1
    score = confidence * 100 if confidence <= 1 else confidence
    
    if score < 50:
        return {
            "severity": "Safe",
            "risk_level": 15,
            "description": "No significant structural flaws detected."
        }
    
    # Heuristic for severity based on detection features
    if score > 90 or contour_count > 50:
        return {
            "severity": "Critical",
            "risk_level": 90,
            "description": "Severe structural cracking detected. Immediate intervention recommended."
        }
    elif score > 70 or contour_count > 20:
        return {
            "severity": "Moderate",
            "risk_level": 55,
            "description": "Structural anomalies detected. Schedule detailed inspection."
        }
    else:
        return {
            "severity": "Safe",
            "risk_level": 25,
            "description": "Minor surface anomalies detected. Regular monitoring suggested."
        }
