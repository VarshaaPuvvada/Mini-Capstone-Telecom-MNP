from fastapi import APIRouter, Depends
from app.schemas.operator_schema import OperatorCreate
from app.services.operator_service import add_operator, list_operators
from app.core.dependencies import get_current_admin

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.post("/operators")
async def create_operator(data: OperatorCreate, admin=Depends(get_current_admin)):
    return await add_operator(data)

@router.get("/operators")
async def get_operators(admin=Depends(get_current_admin)):
    return await list_operators()