from app.core.database import db
from app.models.document_model import document_helper
from datetime import datetime

document_collection = db["documents"]

async def create_document(data: dict):
    data["uploaded_at"] = datetime.utcnow()
    result = await document_collection.insert_one(data)
    doc = await document_collection.find_one({"_id": result.inserted_id})
    return document_helper(doc)

async def get_documents_by_user(user_id: str):
    docs = []
    async for doc in document_collection.find({"user_id": user_id}):
        docs.append(document_helper(doc))
    return docs