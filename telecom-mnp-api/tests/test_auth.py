import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_register_user():
    payload = {
        "name": "Test User",
        "mobile_number": "9999999999",
        "role": "customer",
        "password": "password123"
    }
    response = client.post("/auth/register", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "user" in data
    assert data["user"]["name"] == "Test User"


def test_login_user():
    payload = {
        "mobile_number": "9999999999",
        "password": "password123"
    }
    response = client.post("/auth/login", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data