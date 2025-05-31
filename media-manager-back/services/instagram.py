from instagrapi import Client, exceptions
import os
from services.firestore import FirestoreService
import time

class InstagramService:
    
    cl = Client()
    
    def __init__(self):
        self.login()
    
    def login(self):
        """
        Login to Instagram.
        """
        firestore_service = FirestoreService()

        session_document = firestore_service.get_document('sessions', "main_session")

        if not session_document:
            self.cl.login(os.getenv('INSTAGRAM_USERNAME'), os.getenv('INSTAGRAM_PASSWORD'))
            firestore_service.create_document(collection_name='sessions', document_id="main_session", data={
                "session_id": self.cl.sessionid,
                "timestamp": time.time()
            })
        else:
            try:
                self.cl.login_by_sessionid(sessionid=session_document.get('session_id'))
            except Exception as e:
                print(f"Error logging in: {e}")
                self.cl.login(os.getenv('INSTAGRAM_USERNAME'), os.getenv('INSTAGRAM_PASSWORD'))
                firestore_service.update_document(collection_name='sessions', document_id="main_session", data={
                    "session_id": self.cl.sessionid,
                    "timestamp": time.time()
                })

    def search(self, q: str):
        """
        Search for users on Instagram.
        :param q: The query to search for.
        :return: A list of users.
        """
        try:
            users = self.cl.search_users(q)
            return [
                {
                    "id": u.pk,
                    "username": u.username,
                    "full_name": u.full_name,
                    "profile_pic_url": str(u.profile_pic_url)
                } for u in users
            ]
        except exceptions.LoginRequired as e:
            self.login()
            return self.cl.search_users(q)
    
    def get_posts(self, user_id, limit=0):
        """
        Get posts from a user.
        :param user_id: The ID of the user.
        :param limit: The maximum number of posts to return.
        :return: A list of posts.
        """
        try:
            return [
                {
                    "id": m.id,
                    "title": m.title,
                    "thumbnail_url": str(m.thumbnail_url),
                    "comment_count": m.comment_count,
                    "like_count": m.like_count,
                    "play_count": m.play_count,
                    "caption": m.caption_text,
                    "timestamp": m.taken_at.isoformat(),
                    "video_url": str(m.video_url) if m.video_url else None,
                }
                for m in self.cl.user_medias(user_id, limit)
            ]
        except exceptions.LoginRequired as e:
            self.login()
            return self.cl.user_medias(user_id, limit)
    
    def get_comments(self, id, limit=0):
        """
        Get comments from a post.
        :param id: The ID of the post.
        :param limit: The maximum number of comments to return.
        :return: A list of comments.
        """
        try:
            return self.cl.media_comments(id, limit)
        except exceptions.LoginRequired as e:
            self.login()
            return self.cl.media_comments(id, limit)
