from pydantic import BaseModel, Field, ConfigDict
from datetime import date, datetime
from typing import Optional

class EventCreate(BaseModel):
    title: str = Field(..., max_length=200)
    description: Optional[str] = None
    event_date: datetime
    location: Optional[str] = None
    access_level: Optional[str] = "private"

class EventUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=200)
    description: Optional[str] = None
    event_date: Optional[date] = None
    location: Optional[str] = None
    access_level: Optional[str] = None

class EventRead(BaseModel):
    id: int
    title: str
    description: Optional[str]
    event_date: datetime
    location: Optional[str]
    created_by: int
    access_level: str
    qr_token: Optional[str]
    created_at: datetime
    updated_at: Optional[datetime]

    # Pydantic v2: dùng ConfigDict thay cho class Config
    model_config = ConfigDict(from_attributes=True)

class QRResponse(BaseModel):
    event_id: int
    qr_token: str
    share_url: str