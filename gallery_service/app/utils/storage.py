import os
from fastapi import UploadFile
from uuid import uuid4

# Backend lưu trữ media cho Gallery Service
# - UPLOAD_DIR: thư mục mount từ Docker volume/PVC
# - save_file(): nhận file upload, lưu xuống disk, trả về đường dẫn để ghi vào DB

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def save_file(file: UploadFile) -> str:
    # Sinh tên file duy nhất để tránh trùng lặp
    file_extension = os.path.splitext(file.filename)[1]
    unique_name = f"{uuid4()}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_name)

    # Ghi file vào thư mục volume/PVC
    with open(file_path, "wb") as f:
        f.write(file.file.read())

    # Trả về đường dẫn để Gallery lưu trong DB
    return f"/{UPLOAD_DIR}/{unique_name}"