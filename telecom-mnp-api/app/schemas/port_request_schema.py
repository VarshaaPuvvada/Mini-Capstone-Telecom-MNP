from pydantic import BaseModel, field_validator
from datetime import datetime
from app.utils.validators import validate_mobile_number

class PortRequestCreate(BaseModel):
    mobile_number: str
    current_operator: str
    target_operator: str

    @field_validator('mobile_number')
    def validate_mobile(cls, v):
        if not validate_mobile_number(v):
            raise ValueError('Invalid mobile number format. Must be exactly 10 digits.')
        return v

class PortRequestResponse(BaseModel):
    id: str
    user_id: str
    mobile_number: str
    current_operator: str
    target_operator: str
    status: str
    created_at: datetime