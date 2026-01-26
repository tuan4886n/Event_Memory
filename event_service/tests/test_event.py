import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.auth import get_current_user

# Mock đầy đủ user_id và role
def mocked_get_current_user():
    return {
        "user_id": 1, 
        "username": "testadmin",
        "role": "admin"
    }

client = TestClient(app)

# Biến context để lưu trữ ID và Token giữa các bước test
test_context = {
    "public_event_id": None,
    "private_event_id": None,
    "private_qr_token": None
}

@pytest.fixture(autouse=True)
def setup_auth():
    app.dependency_overrides[get_current_user] = mocked_get_current_user
    yield


def test_health_check():
    """Kiểm tra dịch vụ có đang sống không"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_create_public_event():
    """Tạo một sự kiện Public"""
    payload = {
        "title": "Sự kiện Công Khai",
        "description": "Ai có link cũng xem được",
        "event_date": "2026-05-20T10:00:00",
        "location": "Hà Nội",
        "access_level": "public"
    }
    response = client.post("/events", json=payload)
    assert response.status_code == 201
    test_context["public_event_id"] = response.json()["id"]


def test_access_public_event_no_token():
    """DẠNG 1: Public thì không cần token hoặc token sai vẫn phải 200 OK"""
    app.dependency_overrides.clear() # Đóng vai khách vãng lai
    event_id = test_context["public_event_id"]
    
    # Theo routes.py: if ev.access_level != "public" mới check token. 
    # Vậy public thì token nào cũng được vào.
    response = client.get(f"/events/share/{event_id}?token=any_token_is_fine")
    assert response.status_code == 200
    assert response.json()["id"] == event_id


def test_create_private_event():
    """Tạo một sự kiện Private"""
    payload = {
        "title": "Sự kiện Riêng Tư",
        "description": "Chỉ mã QR mới vào được",
        "event_date": "2026-06-15T19:00:00",
        "location": "Sài Gòn",
        "access_level": "private"
    }
    response = client.post("/events", json=payload)
    assert response.status_code == 201
    test_context["private_event_id"] = response.json()["id"]


def test_generate_qr_for_private():
    """Tạo QR Token cho sự kiện Private vừa tạo"""
    event_id = test_context["private_event_id"]
    response = client.post(f"/events/{event_id}/qr")
    assert response.status_code == 200
    test_context["private_qr_token"] = response.json()["qr_token"]


def test_access_private_event_invalid_token():
    """DẠNG 2: Private mà token sai phải bị chặn 403 (Forbidden)"""
    app.dependency_overrides.clear() # Đóng vai khách vãng lai
    event_id = test_context["private_event_id"]
    
    response = client.get(f"/events/share/{event_id}?token=sai_token_roi")
    
    assert response.status_code == 403
    assert response.json()["detail"] == "Mã QR không hợp lệ"


def test_access_private_event_valid_token():
    """DẠNG 2: Private dùng đúng token phải vào được 200 OK"""
    app.dependency_overrides.clear()
    event_id = test_context["private_event_id"]
    token = test_context["private_qr_token"]
    
    response = client.get(f"/events/share/{event_id}?token={token}")
    assert response.status_code == 200
    assert response.json()["id"] == event_id


def test_update_event():
    """Kiểm tra cập nhật sự kiện (Cần quyền Admin)"""
    event_id = test_context["public_event_id"]
    payload = {"title": "Sự kiện đã đổi tên"}
    response = client.patch(f"/events/{event_id}", json=payload)
    assert response.status_code == 200
    assert response.json()["title"] == "Sự kiện đã đổi tên"


def test_delete_events():
    """Dọn dẹp: Xóa các sự kiện test"""
    for key in ["public_event_id", "private_event_id"]:
        eid = test_context[key]
        if eid:
            response = client.delete(f"/events/{eid}")
            assert response.status_code == 204