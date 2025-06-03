from fastapi import APIRouter
from models.youtube import CommentSummaryResponse, PickCommentResponse, SearchResponse
from services.youtube import pick_random_comment, search, summarize_comments

router = APIRouter(tags=["YouTube"])


@router.get("/search", response_model=SearchResponse)
def get_youtube_data(q: str, scope: str = 'all') -> SearchResponse:
    """
    Search for YouTube videos and channels.
    :param q: The query to search for.
    :param scope: The scope of the search (videos or channels).
    :return: A list of videos and channels.
    """
    return {
        "response": search(q, scope)
    }


@router.get('/comments/summary', response_model=CommentSummaryResponse)
def get_summary(video_id: str) -> CommentSummaryResponse:
    """
    Get a summary of the comments for a video.
    :param video_id: The ID of the video.
    :return: A summary of the comments.
    """
    return {"summary": summarize_comments(video_id)}

@router.get('/comments/pick', response_model=PickCommentResponse)
def pick_comment(video_id: str, needs_subscription: bool = False, channels: str = '') -> PickCommentResponse:
    """
    Pick a random comment from a video.
    :param video_id: The ID of the video.
    :param needs_subscription: Whether the commenter needs to be subscribed.
    :param channels: The channels the commenter needs to be subscribed to.
    :return: A random comment.
    """
    return {"comment": pick_random_comment(video_id=video_id, needs_subscription=needs_subscription, channels=channels.split(','))}
