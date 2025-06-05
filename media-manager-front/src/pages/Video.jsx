import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectVideo, selectComments, selectSummary, getVideo, updateCommentSummary, clearState } from '../store/features/video';
import { formatDateToFrench, decodeHtmlEntities } from '../utils';
import RandomCommentDialog from '../components/dialogs/RandomCommentDialog';
import CommentSummary from '../components/CommentSummary';
import Comment from '../components/Comment';
import axios from 'axios';

export default function Video() {
    const { videoId } = useParams(); // Access the videoId from the URL
    const navigate = useNavigate();

    const videoData = useSelector(selectVideo);
    const commentsData = useSelector(selectComments);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    
    // Random comment picker states
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Use a ref to track if we've already made the API call for this videoId
    const requestMadeRef = useRef({});

    const handleBackClick = () => {
        navigate('/');
    };

    useEffect(() => {
        let isMounted = true;

        const fetchVideo = async () => {
            // Skip if we've already made this request
            if (requestMadeRef.current[videoId]) {
                setLoading(false);
                return;
            }

            // Mark this videoId as requested
            requestMadeRef.current[videoId] = true;

            try {
                await dispatch(getVideo(videoId)).unwrap();
                if (isMounted) {
                    setLoading(false);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err.message || 'Failed to load video');
                    setLoading(false);
                }
            }
        };

        setLoading(true);
        fetchVideo();

        // Cleanup function
        return () => {
            isMounted = false;
            dispatch(clearState()); // Clear the video state when component unmounts
        };
    }, [dispatch, videoId]); // Removed videoData from dependencies

   

    // Check if data is actually available, regardless of loading state
    if (loading || !videoData || !videoData.title) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="px-10 sm:px-40 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex flex-col flex-1">
                {/* Back button */}
                <button
                    onClick={handleBackClick}
                    className="flex items-center text-[#93adc8] hover:text-white mb-4 self-start"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256" className="mr-2">
                        <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
                    </svg>
                    Back to Home
                </button>

                <div className="w-full sm:w-auto sm:min-w-[180px] md:min-w-[240px] flex-shrink-0">
                    <img
                        src={videoData.thumbnail_url}
                        alt={`${videoData.title} video thumbnail`}
                        className="w-full sm:w-1/2 h-auto object-cover rounded-xl sm:rounded-2xl aspect-video"
                        loading="lazy"
                    />
                </div>
                <h2 className="text-white tracking-light text-[28px] font-bold leading-tight px-4 text-left pb-3 pt-5">{decodeHtmlEntities(videoData.title)}</h2>
                <p className="text-[#93adc8] text-sm font-normal leading-normal pb-3 pt-1 px-4">By {videoData.channel_title} | {formatDateToFrench(videoData.published_at)}</p>
                <p className="text-[#93adc8] text-sm font-normal leading-normal pb-3 pt-1 px-4">
                    {videoData.statistics && videoData.statistics.viewCount ? `${videoData.statistics.viewCount} views` : ''}
                    {videoData.statistics && videoData.statistics.likeCount ? ` | ${videoData.statistics.likeCount} likes` : ''}
                    {videoData.statistics && videoData.statistics.commentCount ? ` | ${videoData.statistics.commentCount} comments` : ''}
                </p>
                
                {/* Random Comment Picker Button */}
                <div className="px-4 mb-4">
                    <button 
                        onClick={() => setIsDialogOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                    >
                        Pick Random Comment
                    </button>
                </div>
                
                <h3 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Comments</h3>

                <CommentSummary />

                {
                    commentsData && commentsData.length > 0 ? commentsData.map((comment, index) => (
                        <Comment key={index} comment={comment} />
                    )) : <p className="text-[#93adc8] px-4">No comments available</p>
                }
            </div>
            
            {/* Random Comment Picker Dialog */}
            {isDialogOpen && (
                <RandomCommentDialog setIsDialogOpen={setIsDialogOpen} />
            )}
        </div>
    );
}
