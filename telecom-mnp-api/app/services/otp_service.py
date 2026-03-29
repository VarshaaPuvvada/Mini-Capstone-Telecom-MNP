from app.repositories.otp_repository import create_otp, verify_otp as repo_verify_otp
from app.repositories.port_repository import update_port_status, port_collection
from app.exceptions.custom_exceptions import BadRequestException
from bson import ObjectId

async def send_otp(mobile_number: str) -> dict:
    otp_data = await create_otp(mobile_number)
    print(f"OTP for {mobile_number} is {otp_data['otp']}")  # For testing
    return {"message": "OTP sent successfully"}

async def verify_otp(mobile_number: str, otp: str) -> dict:
    verified = await repo_verify_otp(mobile_number, otp)
    if not verified:
        raise BadRequestException("Invalid or expired OTP")

    port_doc = await port_collection.find_one(
        {"mobile_number": mobile_number},
        sort=[("created_at", -1)]
    )
    if port_doc:
        await update_port_status(str(port_doc["_id"]), "otp_verified")

    return {"success": True, "message": "OTP verified successfully"}