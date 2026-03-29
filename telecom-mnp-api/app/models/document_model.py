from datetime import datetime

def document_helper(doc) -> dict:
    return {
        "id": str(doc["_id"]),
        "user_id": str(doc["user_id"]),
        "type": doc["type"],  # "aadhaar" or "id_proof"
        "file_url": doc["file_url"],
        "uploaded_at": doc.get("uploaded_at", datetime.utcnow())
    }