from fastapi import APIRouter, Depends
from app.services.document_service import fetch_user_documents
from app.core.dependencies import get_current_agent
from app.repositories.port_repository import update_port_status
from app.exceptions.custom_exceptions import NotFoundException

router = APIRouter(prefix="/operator", tags=["Operator APIs"])  

@router.get("/documents/{user_id}")
async def view_user_documents(
    user_id: str,
    agent=Depends(get_current_agent)
):
    return await fetch_user_documents(user_id)

@router.put("/verify-documents/{port_id}")
async def verify_documents(
    port_id: str,
    agent=Depends(get_current_agent)
):
    updated_request = await update_port_status(port_id, "verified")
    if not updated_request:
        raise NotFoundException("Port request not found")
    return {"message": "Documents verified", "port_request": updated_request}