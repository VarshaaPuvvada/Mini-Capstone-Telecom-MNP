from pydantic import BaseModel, field_validator
from app.utils.validators import validate_mobile_number

class OTPSend(BaseModel):
    mobile_number: str

    @field_validator('mobile_number')
    def validate_mobile(cls, v):
        if not validate_mobile_number(v):
            raise ValueError('Invalid mobile number format. Must be exactly 10 digits.')
        return v

class OTPVerify(BaseModel):
    mobile_number: str
    otp: str

    @field_validator('mobile_number')
    def validate_mobile(cls, v):
        if not validate_mobile_number(v):
            raise ValueError('Invalid mobile number format. Must be exactly 10 digits.')
        return v