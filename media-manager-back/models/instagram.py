from pydantic import BaseModel
from typing import Optional

# Define models for response data
class InstagramUser(BaseModel):
    id: str
    username: str
    full_name: Optional[str] = None
    profile_pic_url: Optional[str] = None

class InstagramMedia(BaseModel):
    id: str
    caption: Optional[str] = None
    media_type: str
    media_url: str
    permalink: str
    timestamp: str
    username: str

class InstagramComment(BaseModel):
    id: str
    text: str
    timestamp: str
    username: str