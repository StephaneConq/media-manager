from fastapi import APIRouter
from services.youtube import pick_random_comment, search, summarize_comments

router = APIRouter(tags=["YouTube"])

@router.get("/search")
def get_youtube_data(q: str, scope: str):
    return search(q, scope)

@router.get('/comments/summary')
def get_summary(video_id: str):
    return {"summary": summarize_comments(video_id)}

@router.get('/comments/pick')
def pick_comment(video_id: str, needs_subscription: bool = False, channels: str = ''):
    return {"comment": pick_random_comment(video_id=video_id, needs_subscription=needs_subscription, channels=channels.split(','))}