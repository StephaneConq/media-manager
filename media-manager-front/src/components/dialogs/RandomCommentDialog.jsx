import { useState } from "react";
import { formatDateToFrench, decodeHtmlEntities } from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import { selectVideo } from "../../store/features/video";
import { pickRandomComment } from "../../store/features/video";

export default function RandomCommentDialog({ setIsDialogOpen }) {
    const [needsSubscription, setNeedsSubscription] = useState(false);
    const [randomComment, setRandomComment] = useState(null);
    const [pickingComment, setPickingComment] = useState(false);
    const videoData = useSelector(selectVideo);
    const dispatch = useDispatch();

    const handlePickRandomComment = async () => {
        setPickingComment(true);
        setRandomComment(null);

        try { 
            const response = await pickRandomComment({
                videoId: videoData.id,
                needsSubscription,
                channels: videoData.channel_id
            });

            setRandomComment(response.data.comment);
        } catch (error) {
            console.error('Error picking random comment:', error);
            setRandomComment({ error: 'Failed to pick a random comment. Please try again.' });
        } finally {
            setPickingComment(false);
        }
    };

    return (
        <>

            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
                    <h3 className="text-white text-xl font-bold mb-4">Pick a Random Comment</h3>

                    <div className="flex items-center mb-6">
                        <label className="flex items-center cursor-pointer">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    className="sr-only"
                                    checked={needsSubscription}
                                    onChange={() => setNeedsSubscription(!needsSubscription)}
                                />
                                <div className={`block w-14 h-8 rounded-full ${needsSubscription ? 'bg-blue-600' : 'bg-gray-600'}`}></div>
                                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${needsSubscription ? 'transform translate-x-6' : ''}`}></div>
                            </div>
                            <div className="ml-3 text-white font-medium">
                                Only subscribers
                            </div>
                        </label>
                    </div>

                    <div className="flex justify-between">
                        <button
                            onClick={() => setIsDialogOpen(false)}
                            className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handlePickRandomComment}
                            disabled={pickingComment}
                            className={`bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors ${pickingComment ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {pickingComment ? 'Picking...' : 'Pick Comment'}
                        </button>
                    </div>

                    {/* Display the random comment */}
                    {randomComment && (
                        <div className="mt-6 p-4 bg-gray-700 rounded-lg">
                            {randomComment.error ? (
                                <p className="text-red-400">{randomComment.error}</p>
                            ) : (
                                <>
                                    <div className="flex items-start mb-2">
                                        <div>
                                            <p className="text-white font-medium">{randomComment.author}</p>
                                            {/* <p className="text-gray-400 text-sm">{formatDateToFrench(randomComment.published_at)}</p> */}
                                        </div>
                                    </div>
                                    <p className="text-white">{decodeHtmlEntities(randomComment.text)}</p>
                                    {randomComment.like_count > 0 && (
                                        <p className="text-gray-400 text-sm mt-2">❤️ {randomComment.likes}</p>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

        </>
    )
}