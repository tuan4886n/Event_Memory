import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.auth import get_current_user
import io
from PIL import Image

client = TestClient(app)

# Giả lập user để pass qua Depends(get_current_user)
def override_get_current_user():
    return {"user_id": 1, "role": "admin", "username": "test_devops"}

app.dependency_overrides[get_current_user] = override_get_current_user

# Biến global để lưu ID album và media
created_album_id = None
created_media_id = None


def create_fake_image():
    """Tạo file ảnh giả trong bộ nhớ"""
    file = io.BytesIO()
    image = Image.new("RGB", (100, 100), color="red")
    image.save(file, "jpeg")
    file.name = "test.jpg"
    file.seek(0)
    return file


def test_health_check():
    """Kiểm tra service có đang sống không"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_create_album():
    """Tạo album để dùng cho các test media"""
    global created_album_id
    response = client.post("/albums/", json={"name": "Test Album", "event_id": 1})
    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    created_album_id = data["id"]


def test_upload_media():
    """Upload file ảnh vào album vừa tạo"""
    global created_album_id, created_media_id
    fake_file = create_fake_image()
    files = {"file": ("test.jpg", fake_file, "image/jpeg")}

    response = client.post(f"/media/upload/{created_album_id}", files=files)

    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    created_media_id = data["id"]


def test_get_media_by_id():
    """Lấy thông tin ảnh vừa upload"""
    if not created_media_id:
        return

    response = client.get(f"/media/{created_media_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == created_media_id


def test_delete_media():
    """Xóa ảnh để dọn dẹp hệ thống sau khi test"""
    if not created_media_id:
        return

    response = client.delete(f"/media/{created_media_id}")
    assert response.status_code == 200
    assert response.json()["detail"] == "Media deleted successfully"


def test_upload_wrong_format():
    """Kiểm tra backend chặn file sai định dạng (ví dụ: .txt)"""
    global created_album_id
    fake_text = io.BytesIO(b"day la file text, khong phai anh")
    files = {"file": ("test.txt", fake_text, "text/plain")}

    response = client.post(f"/media/upload/{created_album_id}", files=files)
    assert response.status_code == 400
    assert response.json()["detail"] == "Invalid file format"