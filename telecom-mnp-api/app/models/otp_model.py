from datetime import datetime, timedelta
from bson import ObjectId

def otp_helper(doc) -> dict:
    return {
        "id": str(doc["_id"]),
        "mobile_number": doc["mobile_number"],
        "otp": doc["otp"],
        "verified": doc.get("verified", False),
        "expires_at": doc["expires_at"]
    }

def generate_otp_expiry(minutes: int = 5) -> datetime:
    return datetime.utcnow() + timedelta(minutes=minutes)