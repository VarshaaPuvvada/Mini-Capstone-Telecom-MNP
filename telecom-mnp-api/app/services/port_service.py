from app.repositories.port_repository import create_port_request, get_user_requests, get_all_requests,update_port_status, get_port_by_id
from app.services.otp_service import send_otp
from app.exceptions.custom_exceptions import NotFoundException, BadRequestException

async def create_port(user_id: str, data):
    request_data = data.dict()
    request_data["user_id"] = user_id

    new_request = await create_port_request(request_data)

    await send_otp(request_data["mobile_number"])

    return {
        "message": "Port request created successfully. OTP sent to user for verification.",
        "port_request": new_request
    }

async def get_my_ports(user_id: str):
    return await get_user_requests(user_id)

async def get_ports():
    return await get_all_requests()

async def agent_verify_port(port_id: str):
    port_request = await get_port_by_id(port_id)
    if not port_request:
        raise NotFoundException("Port request not found")

    from app.repositories.otp_repository import get_otp_by_mobile
    otp_log = await get_otp_by_mobile(port_request["mobile_number"])
    if not otp_log or not otp_log["verified"]:
        raise BadRequestException("OTP not verified yet")

    updated_request = await update_port_status(port_id, "verified")
    return {"success": True, "message": "Port request verified by agent", "port_request": updated_request}

async def admin_approve_port(port_id: str):
    port_request = await get_port_by_id(port_id)
    if not port_request:
        raise NotFoundException("Port request not found")
    
    updated_request = await update_port_status(port_id, "approved")
    return {"success": True, "message": "Port request approved", "port_request": updated_request}

async def admin_reject_port(port_id: str):
    port_request = await get_port_by_id(port_id)
    if not port_request:
        raise NotFoundException("Port request not found")
    
    updated_request = await update_port_status(port_id, "rejected")
    return {"success": True, "message": "Port request rejected", "port_request": updated_request}