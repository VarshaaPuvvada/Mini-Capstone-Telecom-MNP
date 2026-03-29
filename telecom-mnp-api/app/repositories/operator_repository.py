from app.core.database import db
from app.models.operator_model import operator_helper
from bson import ObjectId

operator_collection = db["operators"]

async def create_operator(data: dict):
    result = await operator_collection.insert_one(data)
    doc = await operator_collection.find_one({"_id": result.inserted_id})
    return operator_helper(doc)

async def get_all_operators():
    operators = []
    async for doc in operator_collection.find():
        operators.append(operator_helper(doc))
    return operators

async def get_operator_by_id(operator_id: str):
    doc = await operator_collection.find_one({"_id": ObjectId(operator_id)})
    if not doc:
        return None
    return operator_helper(doc)