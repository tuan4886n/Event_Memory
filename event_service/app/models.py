from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from sqlalchemy.types import Date
from app.db import Base

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False, index=True)
    description = Column(Text, nullable=True)
    event_date = Column(DateTime, nullable=False)
    location = Column(String(255), nullable=True)

    # ownership / access
    created_by = Column(Integer, nullable=False, index=True)  # user id (from JWT)
    access_level = Column(String(32), default="private")

    # qr token for sharing
    qr_token = Column(String(128), nullable=True, unique=True, index=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())