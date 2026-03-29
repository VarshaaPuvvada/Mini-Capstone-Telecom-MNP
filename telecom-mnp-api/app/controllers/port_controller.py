from fastapi import APIRouter, Depends
from app.schemas.port_request_schema import PortRequestCreate
from app.services.port_service import create_port, get_my_ports, get_ports,agent_verify_port
from app.core.dependencies import get_current_customer,get_current_admin_or_agent,get_current_agent,get_current_admin
from app.schemas.document_schema import DocumentCreate
from app.services.document_service import upload_document

router = APIRouter(prefix="/port", tags=["Port Requests"])

@router.post("/")
async def create_port_request(
    data: PortRequestCreate,
    user=Depends(get_current_customer)
):
    return await create_port(user["user_id"], data)


@router.get("/my")
async def my_requests(user=Depends(get_current_customer)):
    return await get_my_ports(user["user_id"])


@router.get("/")
async def all_requests(user=Depends(get_current_admin_or_agent)):
    return await get_ports()

@router.put("/{port_id}/verify")
async def verify_port_request(port_id: str, user=Depends(get_current_agent)):
    return await agent_verify_port(port_id)

@router.put("/{port_id}/approve")
async def approve_port_request(port_id: str, user=Depends(get_current_admin)):
    from app.services.port_service import admin_approve_port
    return await admin_approve_port(port_id)

@router.put("/{port_id}/reject")
async def reject_port_request(port_id: str, user=Depends(get_current_admin)):
    from app.services.port_service import admin_reject_port
    return await admin_reject_port(port_id)

@router.post("/documents")
async def upload_port_document(
    data: DocumentCreate,
    user=Depends(get_current_customer)
):
    return await upload_document(user["user_id"], data)