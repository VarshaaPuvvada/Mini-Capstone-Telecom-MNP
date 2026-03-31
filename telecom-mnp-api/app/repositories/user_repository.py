from app.core.database import user_collection
from bson import ObjectId

async def create_user(user_data: dict):
    result = await user_collection.insert_one(user_data)
    return str(result.inserted_id)

async def get_user_by_mobile(mobile_number: str):
    return await user_collection.find_one({"mobile_number": mobile_number})

async def get_user_by_id(user_id: str):
    try:
        obj_id = ObjectId(user_id)
    except Exception:
        return None

    return await user_collection.find_one({"_id": obj_id})
