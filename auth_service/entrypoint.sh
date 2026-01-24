#!/bin/bash
set -e # Dừng script ngay nếu có lệnh nào lỗi

echo "Đợi database..."
sleep 5

# CHỈ CHẠY MIGRATION MỘT LẦN DUY NHẤT Ở ĐÂY
echo "Đang cập nhật Database Schema..."
alembic upgrade head

echo "Khởi động Gunicorn..."
# Cuối cùng mới gọi App
exec "$@"