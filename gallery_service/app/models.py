from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db import Base

class Album(Base):
    __tablename__ = "albums"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(String, nullable=True)
    event_id = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    media_items = relationship(
        "Media",
        back_populates="album",
        cascade="all, delete-orphan"
    )

class Media(Base):
    __tablename__ = "media"
    id = Column(Integer, primary_key=True, index=True)
    album_id = Column(Integer, ForeignKey("albums.id", ondelete="CASCADE"))
    file_url = Column(String(500), nullable=False)
    media_type = Column(String(50), nullable=False)  # image / video
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())

    album = relationship("Album", back_populates="media_items")