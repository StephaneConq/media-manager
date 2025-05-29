import random
import requests
import os
from fastapi import HTTPException
from services.gemini import summarize
import json


def search(q: str, scope: str) -> dict:
    """
    Search for videos or channels on YouTube.
    :param q: The query string.
    :param scope: The type of search. Can be 'videos' or 'channels'.
    :return: dict with list of videos and / or channels
    """
    r = requests.get(
        f"https://www.googleapis.com/youtube/v3/search?part=snippet,id&maxResults=100&q={q}&type={scope}&key={os.getenv('YOUTUBE_API_KEY')}")
    r.raise_for_status()
    result = r.json()
    return {
        "response": {
            "videos": [i for i in result.get('items') if i.get('id').get('kind') == 'youtube#video'],
            "channels": [i for i in result.get('items') if i.get('id').get('kind') == 'youtube#channel']
        }
    }


def get_comments(video_id: str, page_token: str = None) -> dict:
    """
    Fetch comments from a YouTube video.
    :param video_id: The ID of the video to fetch comments from.
    :param page_token: The token for the next page of comments.
    :return: dict with list of comments and next page token
    """
    # Build parameters dict instead of string concatenation
    params = {
        "key": os.getenv('YOUTUBE_API_KEY'),
        "part": "snippet,id,replies",
        "videoId": video_id,
        "maxResults": 100,
        "order": "relevance"
    }
    
    # Only add pageToken if it exists
    if page_token:
        params["pageToken"] = page_token
    
    try:
        r = requests.get("https://www.googleapis.com/youtube/v3/commentThreads", params=params)
        r.raise_for_status()
        result = r.json()
        
        comments = []
        for item in result.get('items', []):
            # Extract nested data more efficiently
            snippet = item.get('snippet', {})
            top_comment = snippet.get('topLevelComment', {}).get('snippet', {})
            author_channel = top_comment.get('authorChannelId', {})
            
            # Build comment object
            comment = {
                "id": item.get('id'),
                "text": top_comment.get('textOriginal'),
                "author": top_comment.get('authorDisplayName'),
                "author_id": author_channel.get('value'),
                "likes": top_comment.get('likeCount', 0),
                "replies": []
            }
            
            # Process replies if they exist
            replies = item.get('replies', {}).get('comments', [])
            if replies:
                comment["replies"] = [
                    {
                        "id": reply.get('id'),
                        "text": reply.get('snippet', {}).get('textOriginal'),
                        "author": reply.get('snippet', {}).get('authorDisplayName'),
                        "likes": reply.get('snippet', {}).get('likeCount', 0)
                    } for reply in replies
                ]
            
            comments.append(comment)
        
        return {
            "comments": comments,
            "nextPageToken": result.get('nextPageToken')
        }
    
    except requests.exceptions.RequestException as e:
        # Handle API errors more gracefully
        error_message = f"YouTube API error: {str(e)}"
        if hasattr(e, 'response') and e.response is not None:
            try:
                error_data = e.response.json()
                if 'error' in error_data and 'message' in error_data['error']:
                    error_message = f"YouTube API error: {error_data['error']['message']}"
            except ValueError:
                pass
        
        # Re-raise as HTTPException if needed, or handle differently
        raise HTTPException(status_code=e.response.status_code if hasattr(e, 'response') else 500, 
                           detail=error_message)


def get_all_comments(video_id: str) -> list:
    """
    Fetch all comments from a YouTube video.
    :param video_id: The ID of the video to fetch comments from.
    :return: list of comments
    """
    comments = []
    page_token = None
    while True:
        res = get_comments(video_id=video_id, page_token=page_token)
        comments.extend(res.get('comments'))
        page_token = res.get('nextPageToken')
        if not page_token:
            break
    return comments


def is_subscribed(author, channels):
    """
    Check if author is subscribed to any of the channels
    :param author: The author of the comment
    :param channels: The list of channels to check
    :return: True if author is subscribed to any of the channels, False otherwise
    """
    
    r = requests.get(f"https://www.googleapis.com/youtube/v3/subscriptions?channelId={author}&key={os.getenv('YOUTUBE_API_KEY')}&part=snippet,contentDetails&maxResults=100&forChannelId={','.join(channels)}")
    
    if r.status_code == 403:
        return False
    
    res = r.json()
    
    if len(res.get('items', [])) == len(channels):
        return True
    
    return False

def pick_random_comment(video_id: str, needs_subscription=False, channels=[], all_comments: list = None, processed_authors = []) -> dict:
    """
    Pick a random comment from a video
    :param video_id: The ID of the video to pick a comment from.
    :param needs_subscription: Whether the comment should be from a subscribed channel
    :param channels: The list of channels to check
    :param all_comments: The list of all comments for the video
    :param processed_authors: The list of authors already processed
    :return: dict with comment
    """

    if not all_comments:
        all_comments = get_all_comments(video_id=video_id)

    comment = random.choice(all_comments)

    if needs_subscription and not is_subscribed(comment.get('author_id'), channels):
        processed_authors.append(comment.get('author_id'))
        available_comments = [c for c in all_comments if c.get('author_id') not in processed_authors]
        
        if available_comments == []:
            raise HTTPException(404, "No comment found meeting requirements")
        
        return pick_random_comment(video_id, needs_subscription, channels, available_comments, processed_authors)

    return comment


def summarize_comments(video_id: str, max_comments: int = 500) -> dict:
    """
    Use Gemini to summarize comments
    :param video_id: The ID of the video to summarize comments from
    :param max_comments: Maximum number of comments to process (default: 500)
    :return: dict with summary
    """
    all_comments = get_all_comments(video_id=video_id)
    
    # Limit the number of comments to prevent processing too much data
    if len(all_comments) > max_comments:
        # Sort by likes to prioritize more relevant comments
        all_comments = sorted(all_comments, key=lambda c: c.get('likes', 0), reverse=True)[:max_comments]
    
    # Transform comments into a more efficient structure without JSON conversion
    formatted_comments = []
    for c in all_comments:
        comment = {
            "author": c.get('author'),
            "text": c.get('text'),
            "likes": c.get('likes'),
            "replies": []
        }
        
        # Only process replies if they exist
        if c.get('replies'):
            comment["replies"] = [
                {
                    "author": r.get('author'),
                    "text": r.get('text'),
                    "likes": r.get('likes'),
                } for r in c.get('replies')
            ]
        
        formatted_comments.append(comment)
    
    # Pass the structured data directly instead of JSON strings
    return summarize([json.dumps(c) for c in formatted_comments])
