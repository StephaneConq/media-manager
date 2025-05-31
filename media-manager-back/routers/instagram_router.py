from fastapi import APIRouter, Query, HTTPException, Depends
from typing import List
import requests

from models.instagram import InstagramComment, InstagramMedia, InstagramUser
from services.instagram import InstagramService

    
# Create router
router = APIRouter(
    tags=["instagram"],
    responses={404: {"description": "Not found"}},
)

# Dependency to get the Instagram service
def get_instagram_service():
    return InstagramService()

@router.get("/search", response_model=List[InstagramUser])
async def search_instagram_users(
    q: str = Query(..., description="Search query for Instagram users"),
    instagram_service: InstagramService = Depends(get_instagram_service)
):
    """
    Search for Instagram users based on the provided query.
    """
    return instagram_service.search(q)

@router.get("/medias", response_model=List[InstagramMedia])
async def get_user_medias(
    user_id: str = Query(..., description="Instagram user ID to fetch media from"),
    instagram_service: InstagramService = Depends(get_instagram_service)
):
    """
    Get media posts for a specific Instagram user.
    """
    return instagram_service.get_posts(user_id)

@router.get("/comments", response_model=List[InstagramComment])
async def get_media_comments(
    media_id: str = Query(..., description="Instagram media ID to fetch comments from"),
    instagram_service: InstagramService = Depends(get_instagram_service)
):
    """
    Get comments for a specific Instagram media post.
    """
    return instagram_service.get_comments(media_id)
