from pydantic import BaseModel, field_validator
from app.utils.validators import validate_operator_name

class OperatorCreate(BaseModel):
    name: str
    circle: str

    @field_validator('name')
    def validate_name(cls, v):
        if not validate_operator_name(v):
            raise ValueError('Operator name must be between 2 and 50 characters.')
        return v

class OperatorOut(BaseModel):
    id: str
    name: str
    circle: str