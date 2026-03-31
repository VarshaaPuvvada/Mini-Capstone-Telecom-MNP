# app/services/user_service.py
from app.repositories.user_repository import create_user, get_user_by_mobile, get_user_by_id
from app.core.security import hash_password, verify_password, create_access_token
from app.models.user_model import user_helper
from app.schemas.auth_schema import UserCreate, UserLogin
from app.exceptions.custom_exceptions import NotFoundException, UnauthorizedException

async def register_user(data: UserCreate):
    user_dict = data.dict()
    user_dict["password"] = hash_password(user_dict["password"])
    user_id = await create_user(user_dict)

    new_user = await get_user_by_mobile(data.mobile_number)
    safe_user = user_helper(new_user)  

    return {"message": "User created", "user": safe_user}


async def login_user(data: UserLogin):
    user = await get_user_by_mobile(data.mobile_number)
    if not user:
        raise NotFoundException("User not found")

    if not verify_password(data.password, user["password"]):
        raise UnauthorizedException("Invalid password")

    token_data = {
        "user_id": str(user["_id"]),
        "role": user["role"]
    }
    access_token = create_access_token(token_data)

    safe_user = user_helper(user)

    return {
        "message": "Login successful",
        "user": safe_user,
        "access_token": access_token,
        "token_type": "bearer"
    }

async def get_current_user_profile(user_payload: dict):
    user = await get_user_by_id(user_payload["user_id"])
    if not user:
        raise NotFoundException("User not found")

    return user_helper(user)
