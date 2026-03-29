from fastapi import APIRouter, Depends
from app.schemas.otp_schema import OTPSend, OTPVerify
from app.services.otp_service import send_otp, verify_otp
from app.core.dependencies import get_current_customer, get_current_agent

router = APIRouter(prefix="/otp", tags=["OTP"])

@router.post("/send")
async def send_otp_endpoint(data: OTPSend, agent=Depends(get_current_agent)):
    return await send_otp(data.mobile_number)

@router.post("/verify")
async def verify_otp_endpoint(data: OTPVerify, customer=Depends(get_current_customer)):
    return await verify_otp(data.mobile_number, data.otp)