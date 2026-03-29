import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def get_customer_token():
    response = client.post("/auth/login", json={
        "mobile_number": "9999999999",
        "password": "password123"
    })
    return response.json()["access_token"]

def get_agent_token():
    response = client.post("/auth/login", json={
        "mobile_number": "8888888888",
        "password": "agentpass"
    })
    return response.json()["access_token"]

def test_send_otp():
    token = get_agent_token()
    headers = {"Authorization": f"Bearer {token}"}
    payload = {"mobile_number": "9999999999"}
    response = client.post("/otp/send", json=payload, headers=headers)
    assert response.status_code == 200
    data = response.json()

def test_verify_otp():
    agent_token = get_agent_token()
    headers_agent = {"Authorization": f"Bearer {agent_token}"}
    payload = {"mobile_number": "9999999999"}
    send_response = client.post("/otp/send", json=payload, headers=headers_agent)
    otp = send_response.json()["otp"]

    customer_token = get_customer_token()
    headers_customer = {"Authorization": f"Bearer {customer_token}"}
    verify_payload = {"mobile_number": "9999999999", "otp": otp}
    verify_response = client.post("/otp/verify", json=verify_payload, headers=headers_customer)
    assert verify_response.status_code == 200
    data = verify_response.json()
    assert "OTP verified" in data["message"]