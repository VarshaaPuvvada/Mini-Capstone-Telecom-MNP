import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def get_agent_token():
    response = client.post("/auth/login", json={
        "mobile_number": "8888888888",  # create an agent in DB first
        "password": "agentpass"
    })
    return response.json()["access_token"]

def test_agent_view_documents():
    token = get_agent_token()
    headers = {"Authorization": f"Bearer {token}"}
    user_id = "some_user_id_here"  # replace with actual ID from DB
    response = client.get(f"/operator/documents/{user_id}", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

def test_agent_verify_documents():
    token = get_agent_token()
    headers = {"Authorization": f"Bearer {token}"}
    port_id = "some_port_id_here"  # replace with actual port request ID
    response = client.put(f"/operator/verify-documents/{port_id}", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["port_request"]["status"] == "verified"