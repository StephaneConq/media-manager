import random
import requests
import os
from fastapi import HTTPException


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


def get_comments(video_id: str, page_token: str = None) -> list:
    """
    Fetch comments from a YouTube video.
    :param video_id: The ID of the video to fetch comments from.
    :param page_token: The token for the next page of comments.
    :return: dict with list of comments and next page token
    """
    r = requests.get(
        f"https://www.googleapis.com/youtube/v3/commentThreads?key={os.getenv('YOUTUBE_API_KEY')}&part=snippet,id,replies&videoId={video_id}&maxResults=100&order=relevance&pageToken={page_token if page_token else ''}")
    r.raise_for_status()
    result = r.json()
    return {
        "comments": [
            {
                "id": i.get('id'),
                "text": i.get('snippet').get('topLevelComment').get('snippet').get('textOriginal'),
                "author": i.get('snippet').get('topLevelComment').get('snippet').get('authorDisplayName'),
                "author_id": i.get('snippet').get('topLevelComment').get('snippet').get('authorChannelId').get('value'),
                "likes": i.get('snippet').get('topLevelComment').get('snippet').get('likeCount'),
                "replies": [
                    {
                        "id": j.get('id'),
                        "text": j.get('snippet').get('textOriginal'),
                        "author": j.get('snippet').get('authorDisplayName'),
                        "likes": j.get('snippet').get('likeCount')
                    } for j in i.get('replies', {}).get('comments', [])
                ]
            } for i in result.get('items')
        ],
        "nextPageToken": result.get('nextPageToken')
    }


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
