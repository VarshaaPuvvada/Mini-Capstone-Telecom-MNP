from app.repositories.document_repository import create_document, get_documents_by_user

async def upload_document(user_id: str, data):
    doc_data = data.dict()
    doc_data["user_id"] = user_id
    return await create_document(doc_data)

async def fetch_user_documents(user_id: str):
    return await get_documents_by_user(user_id)