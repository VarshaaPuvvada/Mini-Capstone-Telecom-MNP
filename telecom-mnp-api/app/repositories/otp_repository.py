from app.core.database import db
from app.models.otp_model import otp_helper, generate_otp_expiry
import random
from datetime import datetime

otp_collection = db["otp_logs"]

async def create_otp(mobile_number: str) -> dict:
    otp = str(random.randint(100000, 999999))  
    expires_at = generate_otp_expiry()
    otp_doc = {
        "mobile_number": mobile_number,
        "otp": otp,
        "verified": False,
        "expires_at": expires_at
    }
    await otp_collection.insert_one(otp_doc)
    return otp_helper(otp_doc)

async def verify_otp(mobile_number: str, otp: str) -> bool:
    doc = await otp_collection.find_one({"mobile_number": mobile_number, "otp": otp})
    if not doc:
        return False
    if datetime.utcnow() > doc["expires_at"]:
        return False
    await otp_collection.update_one({"_id": doc["_id"]}, {"$set": {"verified": True}})
    return True

async def get_otp_by_mobile(mobile_number: str) -> dict | None:
    doc = await otp_collection.find_one(
        {"mobile_number": mobile_number}, 
        sort=[("expires_at", -1)]  # get latest OTP
    )
    if not doc:
        return None
    return otp_helper(doc)