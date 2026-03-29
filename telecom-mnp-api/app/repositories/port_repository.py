from app.core.database import db
from datetime import datetime
from bson import ObjectId
from app.models.port_request_model import port_request_helper

port_collection = db["port_requests"]

async def create_port_request(data: dict):
    data["status"] = "initiated"
    data["created_at"] = datetime.utcnow()
    result = await port_collection.insert_one(data)    
    doc = await port_collection.find_one({"_id": result.inserted_id})
    return port_request_helper(doc)

async def get_user_requests(user_id: str):
    requests = []
    async for doc in port_collection.find({"user_id": user_id}):
        requests.append(port_request_helper(doc))
    return requests

async def get_all_requests():
    requests = []
    async for doc in port_collection.find():
        requests.append(port_request_helper(doc))
    return requests

async def get_port_by_id(port_id: str):
    try:
        obj_id = ObjectId(port_id)
    except Exception:
        return None 

    doc = await port_collection.find_one({"_id": obj_id})
    if not doc:
        return None
    return port_request_helper(doc)

async def update_port_status(port_id: str, status: str):
    try:
        obj_id = ObjectId(port_id)
    except Exception:
        return None  

    await port_collection.update_one({"_id": obj_id}, {"$set": {"status": status}})
    updated = await port_collection.find_one({"_id": obj_id})
    if not updated:
        return None
    return port_request_helper(updated)