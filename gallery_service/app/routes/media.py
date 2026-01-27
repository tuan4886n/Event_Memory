from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query
from sqlalchemy.orm import Session
from app import crud, schemas, models
from app.db import SessionLocal
from app.utils.storage import save_file
from app.auth import get_current_user
from PIL import Image
import os

router = APIRouter(
    prefix="/media",
    tags=["media"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Hàm tạo thumbnail từ file gốc
def create_thumbnail(file_url: str) -> str | None:
    try:
        filename = file_url.split("/")[-1]
        file_path = os.path.join("uploads", filename)

        thumb_name = f"thumb_{filename}"
        thumb_path = os.path.join("uploads", thumb_name)

        img = Image.open(file_path)
        img.thumbnail((200, 200))
        img.save(thumb_path)

        return f"/uploads/{thumb_name}"
    except Exception as e:
        print("Thumbnail error:", e)
        return None

# Thêm media vào album
@router.post("/album/{album_id}", response_model=schemas.Media)
def add_media(album_id: int, media: schemas.MediaCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    album = crud.get_album(db=db, album_id=album_id)
    if not album:
        raise HTTPException(status_code=404, detail="Album not found")
    if album.created_by != user["user_id"] and user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Forbidden")
    return crud.add_media(db=db, media=media, album_id=album_id)

# Lấy media của album với phân trang
@router.get("/album/{album_id}")
def get_media_by_album(
    album_id: int,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    album = crud.get_album(db=db, album_id=album_id)
    if not album:
        raise HTTPException(status_code=404, detail="Album not found")
    total = crud.count_media_by_album(db=db, album_id=album_id)
    skip = (page - 1) * limit
    media_items = crud.get_media_by_album(db=db, album_id=album_id, skip=skip, limit=limit)

    if not media_items:
        raise HTTPException(status_code=404, detail="No media found for this album")

    return {
        "items": media_items,
        "page": page,
        "limit": limit,
        "total": total
    }

# Lấy media theo id
@router.get("/{media_id}", response_model=schemas.Media)
def get_media(media_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    media = db.query(models.Media).filter(models.Media.id == media_id).first()
    if not media:
        raise HTTPException(status_code=404, detail="Media not found")
    return media

# Xóa media theo id
@router.delete("/{media_id}")
def delete_media(media_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    media = db.query(models.Media).filter(models.Media.id == media_id).first()
    if not media:
        raise HTTPException(status_code=404, detail="Media not found")
    album = crud.get_album(db=db, album_id=media.album_id)
    if album.created_by != user["user_id"] and user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Forbidden")
    result = crud.delete_media(db=db, media_id=media_id)
    return {"detail": "Media deleted successfully"}

# Upload file vào album
@router.post("/upload/{album_id}", response_model=schemas.Media)
async def upload_media(album_id: int, file: UploadFile = File(...), db: Session = Depends(get_db), user=Depends(get_current_user)):
    album = crud.get_album(db=db, album_id=album_id)
    if not album:
        raise HTTPException(status_code=404, detail="Album not found")
    if album.created_by != user["user_id"] and user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Forbidden")

    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file format")

    # Ghi file xuống thư mục uploads
    file_url = save_file(file)

    # Tạo thumbnail
    thumb_url = create_thumbnail(file_url)

    # Tạo bản ghi Media trong DB
    media_data = schemas.MediaCreate(
        file_url=file_url,
        media_type="image"
    )
    return crud.add_media(db=db, media=media_data, album_id=album_id)