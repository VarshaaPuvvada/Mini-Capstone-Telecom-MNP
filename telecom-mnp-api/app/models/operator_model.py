from app.schemas.operator_schema import OperatorCreate

def operator_helper(doc) -> dict:
    return {
        "id": str(doc["_id"]),
        "name": doc["name"],
        "circle": doc["circle"]
    }