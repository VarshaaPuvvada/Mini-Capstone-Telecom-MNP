import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

# Helper to login and get token
def get_token():
    response = client.post("/auth/login", json={
        "mobile_number": "9999999999",
        "password": "password123"
    })
    return response.json()["access_token"]

def test_create_port_request():
    token = get_token()
    payload = {
        "mobile_number": "9999999999",
        "current_operator": "Airtel",
        "target_operator": "Jio"
    }
    headers = {"Authorization": f"Bearer {token}"}
    response = client.post("/port/", json=payload, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["port_request"]["status"] == "initiated"

def test_view_my_requests():
    token = get_token()
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/port/my", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)