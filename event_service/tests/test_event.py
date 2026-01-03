from fastapi.testclient import TestClient
from app.main import app
from app.auth import get_current_user

# Override auth để test không cần JWT
app.dependency_overrides[get_current_user] = lambda: {"user_id": "testuser"}

client = TestClient(app)


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_create_event():
    payload = {
        "title": "Test Event",
        "description": "Demo event",
        "event_date": "2025-12-31",
        "location": "HCMC",
        "access_level": "private"
    }
    response = client.post("/events", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Test Event"
    assert "id" in data
    # Lưu id để dùng cho các test sau
    global created_event_id
    created_event_id = data["id"]


def test_get_events():
    response = client.get("/events")
    assert response.status_code == 200
    events = response.json()
    assert isinstance(events, list)
    assert any(e["id"] == created_event_id for e in events)


def test_get_event_by_id():
    response = client.get(f"/events/{created_event_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == created_event_id
    assert data["title"] == "Test Event"


def test_update_event():
    payload = {"title": "Updated Event"}
    response = client.patch(f"/events/{created_event_id}", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Updated Event"


def test_delete_event():
    response = client.delete(f"/events/{created_event_id}")
    assert response.status_code == 204


def test_create_event_unauthorized():
    # Clear override để test trường hợp không có auth
    app.dependency_overrides.clear()
    payload = {"title": "Fail Event", "event_date": "2025-12-31"}
    response = client.post("/events", json=payload)
    assert response.status_code == 401
    # Restore override để các test khác không bị ảnh hưởng
    app.dependency_overrides[get_current_user] = lambda: {"user_id": "testuser"}

def test_generate_event_qr():
    # Tạo event trước
    payload = {
        "title": "QR Event",
        "description": "Event with QR",
        "event_date": "2025-12-31",
        "location": "HCMC",
        "access_level": "private"
    }
    response = client.post("/events", json=payload)
    assert response.status_code == 201
    event_id = response.json()["id"]

    # Generate QR
    response = client.post(f"/events/{event_id}/qr")
    assert response.status_code == 200
    data = response.json()
    assert data["event_id"] == event_id
    assert "qr_token" in data
    assert "share_url" in data


def test_access_event_via_qr():
    # Tạo event public
    payload = {
        "title": "Public Event",
        "description": "Accessible via QR",
        "event_date": "2025-12-31",
        "location": "HCMC",
        "access_level": "public"
    }
    response = client.post("/events", json=payload)
    assert response.status_code == 201
    event_id = response.json()["id"]

    # Generate QR
    qr_response = client.post(f"/events/{event_id}/qr")
    token = qr_response.json()["qr_token"]

    # Access via QR
    response = client.get(f"/events/share/{event_id}?token={token}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == event_id
    assert data["title"] == "Public Event"