from app.core.database import user_collection

async def create_user(user_data: dict):
    result = await user_collection.insert_one(user_data)
    return str(result.inserted_id)

async def get_user_by_mobile(mobile_number: str):
    return await user_collection.find_one({"mobile_number": mobile_number})