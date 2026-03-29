from datetime import datetime

def port_request_helper(doc) -> dict:
    return {
        "id": str(doc["_id"]),
        "user_id": str(doc["user_id"]),
        "mobile_number": doc["mobile_number"],
        "current_operator": doc["current_operator"],
        "target_operator": doc["target_operator"],
        "status": doc.get("status", "initiated"),
        "created_at": doc.get("created_at", datetime.utcnow())
    }