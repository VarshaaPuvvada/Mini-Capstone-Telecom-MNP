from app.schemas.auth_schema import UserCreate

def user_helper(doc) -> dict:
    return {
        "id": str(doc["_id"]),         
        "name": doc["name"],
        "mobile_number": doc["mobile_number"],
        "role": doc["role"]
    }