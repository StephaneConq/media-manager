from typing import Dict, List, Any, Literal, Union
from pydantic import BaseModel

class Video(BaseModel):
    id: str
    title: str
    description: str
    thumbnail_url: str
    channel_id: str
    channel_title: str
    published_at: str


class Channel(BaseModel):
    id: str
    title: str
    description: str
    thumbnail_url: str
    published_at: str


class SearchResponse(BaseModel):
    # Assuming search returns a dictionary with video data
    response: Dict[Literal['videos', 'channels'], Union[List[Video], List[Channel]]]


class CommentSummaryResponse(BaseModel):
    summary: str


class PickCommentResponse(BaseModel):
    comment: Dict[str, Any]

