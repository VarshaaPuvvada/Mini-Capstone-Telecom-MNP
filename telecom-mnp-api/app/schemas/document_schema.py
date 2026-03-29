from pydantic import BaseModel

class DocumentCreate(BaseModel):
    type: str  # "aadhaar" or "id_proof"
    file_url: str

class DocumentResponse(BaseModel):
    id: str
    user_id: str
    type: str
    file_url: str
    uploaded_at: str