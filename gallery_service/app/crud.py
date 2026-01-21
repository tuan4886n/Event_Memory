from sqlalchemy.orm import Session
import app.models as models
import app.schemas as schemas

# Album CRUD

def create_album(db: Session, album: schemas.AlbumCreate):
    """Tạo album mới"""
    db_album = models.Album(**album.model_dump())
    db.add(db_album)
    db.commit()
    db.refresh(db_album)
    return db_album

def get_album_by_event(db: Session, event_id: int):
    """Lấy album theo event_id"""
    return db.query(models.Album).filter(models.Album.event_id == event_id).first()

def delete_album(db: Session, album_id: int):
    """Xóa album theo id"""
    album = db.query(models.Album).filter(models.Album.id == album_id).first()
    if not album:
        return None
    db.delete(album)
    db.commit()
    return True

# Media CRUD

def add_media(db: Session, media: schemas.MediaCreate, album_id: int):
    """Thêm media vào album"""
    db_media = models.Media(**media.model_dump(), album_id=album_id)
    db.add(db_media)
    db.commit()
    db.refresh(db_media)
    return db_media

def get_media_by_album(db: Session, album_id: int, skip: int = 0, limit: int = 10):
    """Lấy danh sách media theo album với phân trang"""
    return (
        db.query(models.Media)
        .filter(models.Media.album_id == album_id)
        .offset(skip)
        .limit(limit)
        .all()
    )

def count_media_by_album(db: Session, album_id: int) -> int:
    """Đếm tổng số media trong album"""
    return db.query(models.Media).filter(models.Media.album_id == album_id).count()

def delete_media(db: Session, media_id: int):
    """Xóa media theo id"""
    media = db.query(models.Media).filter(models.Media.id == media_id).first()
    if not media:
        return None
    db.delete(media)
    db.commit()
    return True