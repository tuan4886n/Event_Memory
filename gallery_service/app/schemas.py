from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import datetime

# ------------------ MEDIA ------------------
class MediaBase(BaseModel):
    file_url: str
    media_type: str

class MediaCreate(MediaBase):
    pass

class Media(MediaBase):
    id: int
    album_id: int
    uploaded_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)

# ------------------ ALBUM ------------------
class AlbumBase(BaseModel):
    name: str
    description: Optional[str] = None
    event_id: int

class AlbumCreate(AlbumBase):
    # không cho client gửi created_by, backend sẽ tự gán
    pass

class Album(AlbumBase):
    id: int
    created_by: int
    created_at: datetime.datetime
    media_items: List[Media] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)