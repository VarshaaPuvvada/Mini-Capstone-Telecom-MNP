from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

client = AsyncIOMotorClient(settings.MONGO_URI)
db = client[settings.DB_NAME]

user_collection = db["users"]
operator_collection = db["operators"]
port_collection = db["port_requests"]
document_collection = db["documents"]
otp_collection = db["otp_logs"]