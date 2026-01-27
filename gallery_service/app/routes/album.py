from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, schemas
from app.db import SessionLocal
from app.auth import get_current_user

router = APIRouter(
    prefix="/albums",
    tags=["albums"],
)

# Dependency để lấy session DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Tạo album mới
@router.post("/", response_model=schemas.Album)
def create_album(album: schemas.AlbumCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    if user["role"] not in ["user", "admin"]:
        raise HTTPException(status_code=403, detail="Forbidden")
    return crud.create_album(db=db, album=album, created_by=user["user_id"])

# Lấy album theo event_id
@router.get("/event/{event_id}", response_model=schemas.Album)
def get_album_by_event(event_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    album = crud.get_album_by_event(db=db, event_id=event_id)
    if not album:
        raise HTTPException(status_code=404, detail="Album not found for this event")
    return album

# Xóa album theo album_id
@router.delete("/{album_id}")
def delete_album(album_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    album = crud.get_album(db=db, album_id=album_id)
    if not album:
        raise HTTPException(status_code=404, detail="Album not found")
    if album.created_by != user["user_id"] and user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Forbidden")
    result = crud.delete_album(db=db, album_id=album_id)
    return {"detail": "Album deleted successfully"}