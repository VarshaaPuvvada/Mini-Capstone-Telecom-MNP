from pydantic import BaseModel, field_validator
from app.utils.validators import validate_mobile_number

class UserCreate(BaseModel):
    name: str
    mobile_number: str
    role: str
    password: str

    @field_validator('mobile_number')
    def validate_mobile(cls, v):
        if not validate_mobile_number(v):
            raise ValueError('Invalid mobile number format. Must be exactly 10 digits.')
        return v


class UserLogin(BaseModel):
    mobile_number: str
    password: str

    @field_validator('mobile_number')
    def validate_mobile(cls, v):
        if not validate_mobile_number(v):
            raise ValueError('Invalid mobile number format. Must be exactly 10 digits.')
        return v