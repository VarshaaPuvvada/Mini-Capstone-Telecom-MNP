from fastapi import APIRouter,Depends,Header
from app.schemas.auth_schema import UserCreate, UserLogin
from app.services.auth_service import register_user, login_user
from app.core.dependencies import get_current_user,get_current_customer,get_current_agent,get_current_admin

router = APIRouter()

@router.post("/register")
async def register(data: UserCreate):
    return await register_user(data)

@router.post("/login")
async def login(data: UserLogin):
    return await login_user(data)

@router.get("/me")
async def get_me(user=Depends(get_current_user)):
    return user

# @router.get("/me")
# async def get_me(authorization: str = Header()):
#     return {"received_header": authorization}

@router.get("/customer-dashboard")
async def customer_dashboard(user=Depends(get_current_customer)):
    return {"message": "Welcome Customer", "user": user}


@router.get("/agent-dashboard")
async def agent_dashboard(user=Depends(get_current_agent)):
    return {"message": "Welcome Agent", "user": user}


@router.get("/admin-dashboard")
async def admin_dashboard(user=Depends(get_current_admin)):
    return {"message": "Welcome Admin", "user": user}