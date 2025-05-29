from fastapi import APIRouter
from services.youtube import pick_random_comment, search

router = APIRouter(tags=["YouTube"])

@router.get("/search")
def get_youtube_data(q: str, scope: str):
    return search(q, scope)

@router.get('/comments/summary')
def summarize_comments(video_id: str):
    pass

@router.get('/comments/pick')
def pick_comment(video_id: str, needs_subscription: bool = False, channels: str = ''):
    return pick_random_comment(video_id=video_id, needs_subscription=needs_subscription, channels=channels.split(','))