import pytest
from unittest.mock import AsyncMock
from datetime import datetime, timedelta
from jose import jwt

import app.controllers.auth_controller as auth_controller
import app.controllers.operator_controller as operator_controller
import app.controllers.otp_controller as otp_controller
import app.controllers.port_controller as port_controller
import app.core.dependencies as dependencies
import app.repositories.user_repository as user_repo
import app.repositories.operator_repository as operator_repo
import app.repositories.document_repository as document_repo
import app.repositories.port_repository as port_repo
import app.repositories.otp_repository as otp_repo
import app.services.auth_service as auth_service
import app.services.document_service as document_service
import app.services.port_service as port_service
import app.services.otp_service as otp_service
import app.core.security as security
from app.core.config import settings

@pytest.fixture(autouse=True)
def mock_db(monkeypatch):
    # Helper function to create valid JWT tokens for testing
    def create_test_token(user_id: str, role: str) -> str:
        data = {
            "user_id": user_id,
            "role": role
        }
        expire = datetime.utcnow() + timedelta(minutes=30)
        data.update({"exp": expire})
        token = jwt.encode(data, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
        return token
    
    # Mock password verification to always pass in tests
    monkeypatch.setattr(security, "verify_password", lambda *args, **kwargs: True)
    monkeypatch.setattr(auth_service, "verify_password", lambda *args, **kwargs: True)

    # Users used in tests
    customer = {
        "_id": "cust1",
        "name": "Test User",
        "mobile_number": "9999999999",
        "role": "customer",
        "password": "password123",
    }
    agent = {
        "_id": "agent1",
        "name": "Agent User",
        "mobile_number": "8888888888",
        "role": "agent",
        "password": "agentpass",
    }
    
    # Create valid tokens for each user
    customer_token = create_test_token("cust1", "customer")
    agent_token = create_test_token("agent1", "agent")

    async def fake_get_user_by_mobile(mobile_number: str):
        if mobile_number == customer["mobile_number"]:
            return customer
        if mobile_number == agent["mobile_number"]:
            return agent
        return None

    monkeypatch.setattr(user_repo, "create_user", AsyncMock(return_value="cust1"))
    monkeypatch.setattr(user_repo, "get_user_by_mobile", AsyncMock(side_effect=fake_get_user_by_mobile))
    monkeypatch.setattr(auth_service, "create_user", AsyncMock(return_value="cust1"))
    monkeypatch.setattr(auth_service, "get_user_by_mobile", AsyncMock(side_effect=fake_get_user_by_mobile))

    # OTP repository mocks
    otp_record = {"_id": "otp1", "mobile_number": "9999999999", "otp": "123456", "verified": True}
    monkeypatch.setattr(otp_repo, "create_otp", AsyncMock(return_value=otp_record))
    monkeypatch.setattr(otp_repo, "verify_otp", AsyncMock(return_value=True))
    monkeypatch.setattr(otp_repo, "get_otp_by_mobile", AsyncMock(return_value=otp_record))

    # Document repository mocks
    mock_doc = {"_id": "doc1", "user_id": "cust1", "status": "pending"}
    monkeypatch.setattr(document_repo, "create_document", AsyncMock(return_value=mock_doc))
    monkeypatch.setattr(document_repo, "get_documents_by_user", AsyncMock(return_value=[mock_doc]))
    monkeypatch.setattr(document_service, "create_document", AsyncMock(return_value=mock_doc))
    monkeypatch.setattr(document_service, "fetch_user_documents", AsyncMock(return_value=[mock_doc]))

    # Port repository mocks
    port_doc = {"_id": "port1", "user_id": "cust1", "mobile_number": "9999999999", "status": "initiated"}
    mock_port_verified = {"_id": "port1", "user_id": "cust1", "mobile_number": "9999999999", "status": "verified"}

    monkeypatch.setattr(port_repo, "create_port_request", AsyncMock(return_value=port_doc))
    monkeypatch.setattr(port_repo, "get_user_requests", AsyncMock(return_value=[port_doc]))
    monkeypatch.setattr(port_repo, "get_all_requests", AsyncMock(return_value=[port_doc]))
    monkeypatch.setattr(port_repo, "get_port_by_id", AsyncMock(return_value=port_doc))
    monkeypatch.setattr(port_repo, "update_port_status", AsyncMock(return_value=mock_port_verified))

    monkeypatch.setattr(port_service, "create_port", AsyncMock(return_value={"message":"Port request created successfully. OTP sent to user for verification.", "port_request":port_doc}))
    monkeypatch.setattr(port_service, "get_my_ports", AsyncMock(return_value=[port_doc]))
    monkeypatch.setattr(port_service, "get_ports", AsyncMock(return_value=[port_doc]))
    monkeypatch.setattr(port_service, "agent_verify_port", AsyncMock(return_value={"success": True, "message":"Port request verified by agent", "port_request": mock_port_verified}))

    # OTP service + repo mocks
    monkeypatch.setattr(otp_repo, "create_otp", AsyncMock(return_value=otp_record))
    monkeypatch.setattr(otp_repo, "verify_otp", AsyncMock(return_value=True))
    monkeypatch.setattr(otp_repo, "get_otp_by_mobile", AsyncMock(return_value=otp_record))
    monkeypatch.setattr(otp_service, "send_otp", AsyncMock(return_value={"message": "OTP sent successfully"}))
    monkeypatch.setattr(otp_service, "verify_otp", AsyncMock(return_value={"success": True, "message": "OTP verified successfully"}))

    # Operator repository mocks (if used)
    monkeypatch.setattr(operator_repo, "get_all_operators", AsyncMock(return_value=[]))
    monkeypatch.setattr(operator_repo, "get_operator_by_id", AsyncMock(return_value={"_id": "op1", "name": "Operator"}))
    monkeypatch.setattr(operator_repo, "create_operator", AsyncMock(return_value={"_id": "op1", "name": "Operator"}))

    # Controller override mocks (prevent database path and ensure deterministic output)
    monkeypatch.setattr(auth_controller, "register_user", AsyncMock(return_value={"message": "User created", "user": customer}))
    
    # Mock login to return proper valid JWT tokens based on role
    async def mock_login(data):
        if data.mobile_number == customer["mobile_number"]:
            return {"message": "Login successful", "user": customer, "access_token": customer_token, "token_type": "bearer"}
        elif data.mobile_number == agent["mobile_number"]:
            return {"message": "Login successful", "user": agent, "access_token": agent_token, "token_type": "bearer"}
        else:
            return {"error": "User not found"}
    
    monkeypatch.setattr(auth_controller, "login_user", AsyncMock(side_effect=mock_login))

    monkeypatch.setattr(operator_controller, "fetch_user_documents", AsyncMock(return_value=[{"_id": "doc1", "user_id": "some_user_id_here"}]))
    monkeypatch.setattr(operator_controller, "update_port_status", AsyncMock(return_value={"_id": "port1", "status": "verified"}))

    monkeypatch.setattr(otp_controller, "send_otp", AsyncMock(return_value={"message": "OTP sent successfully"}))
    monkeypatch.setattr(otp_controller, "verify_otp", AsyncMock(return_value={"success": True, "message": "OTP verified successfully"}))

    monkeypatch.setattr(port_controller, "create_port", AsyncMock(return_value={"message": "Port request created successfully. OTP sent to user for verification.", "port_request": {"_id": "port1", "status": "initiated"}}))
    monkeypatch.setattr(port_controller, "get_my_ports", AsyncMock(return_value=[{"_id": "port1", "user_id": "cust1", "status": "initiated"}]))

    monkeypatch.setattr(dependencies, "get_current_user", lambda credentials=None: customer)
    monkeypatch.setattr(dependencies, "get_current_agent", lambda user=None: agent)
    monkeypatch.setattr(dependencies, "get_current_customer", lambda user=None: customer)
    monkeypatch.setattr(dependencies, "get_current_admin", lambda user=None: customer)

    monkeypatch.setattr(otp_controller, "send_otp", AsyncMock(return_value={"message": "OTP sent successfully", "otp": "123456"}))
    monkeypatch.setattr(otp_controller, "verify_otp", AsyncMock(return_value={"success": True, "message": "OTP verified successfully"}))

