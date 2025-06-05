import { useState, useEffect } from 'react';
import { formatDateToFrench } from '../utils';

export default function Comment({ comment }) {
    const [showReplies, setShowReplies] = useState(false);

    // Safely check for replies
    const hasReplies = Array.isArray(comment?.replies) && comment.replies.length > 0;

    const toggleReplies = () => {
        setShowReplies(!showReplies);
    };

    // Safety check in case comment is undefined
    if (!comment) {
        console.log('Comment is undefined');
        return <div className="text-red-500">Comment data missing</div>;
    }

    return (
        <div className='comment bg-[#111a22] rounded-md mb-2'>
            <div className="flex items-center gap-4 px-4 min-h-[72px] py-2">
                <div className="flex flex-col justify-center">
                    <p className="text-white text-base font-medium leading-normal line-clamp-1">{comment.author}</p>
                    {comment.date && (
                        <p className="text-[#93adc8] text-xs">{formatDateToFrench(comment.date)}</p>
                    )}
                </div>
            </div>
            <p className="text-white text-base font-normal leading-normal pb-3 pt-1 px-4">
                {comment.text}
            </p>
            <div className="flex flex-wrap gap-4 px-4 py-2">
                <div className="flex items-center justify-center gap-2 px-3 py-2">
                    <div className="text-[#93adc8]" data-icon="ThumbsUp" data-size="24px" data-weight="regular">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                            <path
                                d="M234,80.12A24,24,0,0,0,216,72H160V56a40,40,0,0,0-40-40,8,8,0,0,0-7.16,4.42L75.06,96H32a16,16,0,0,0-16,16v88a16,16,0,0,0,16,16H204a24,24,0,0,0,23.82-21l12-96A24,24,0,0,0,234,80.12ZM32,112H72v88H32ZM223.94,97l-12,96a8,8,0,0,1-7.94,7H88V105.89l36.71-73.43A24,24,0,0,1,144,56V80a8,8,0,0,0,8,8h64a8,8,0,0,1,7.94,9Z"
                            ></path>
                        </svg>
                    </div>
                    <p className="text-[#93adc8] text-[13px] font-bold leading-normal tracking-[0.015em]">{comment.likes}</p>
                </div>
            </div>

            {hasReplies && (
                <div className="px-4 py-2 border-t border-[#1e2a36]">

                    <button
                        onClick={toggleReplies}
                        className="bg-[#1e2a36] text-[#93adc8] text-sm font-medium hover:text-white transition-colors flex items-center gap-1 px-3 py-1 rounded"
                    >
                        {showReplies ? 'Hide' : 'Show'} {comment.replies.length} {comment.replies.length === 1 ? 'Reply' : 'Replies'}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                            className={`transition-transform ${showReplies ? 'rotate-180' : ''}`}
                        >
                            <path d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z" />
                        </svg>
                    </button>

                </div>
            )}

            {/* Replies section */}
            {hasReplies && showReplies && (
                <div className="ml-6 pl-4 border-l-2 border-[#1e2a36] mt-2 mb-3 mx-4">
                    {comment.replies.map((reply, index) => (
                        <div key={index} className="comment bg-[#0d151c] rounded-md mb-2">
                            <div className="flex items-center gap-4 px-4 min-h-[60px] py-2">
                                <div className="flex flex-col justify-center">
                                    <p className="text-white text-sm font-medium leading-normal line-clamp-1">{reply.author}</p>
                                    {reply.date && (
                                        <p className="text-[#93adc8] text-xs">{formatDateToFrench(reply.date)}</p>
                                    )}
                                </div>
                            </div>
                            <p className="text-white text-sm font-normal leading-normal pb-3 pt-1 px-4">
                                {reply.text}
                            </p>
                            <div className="flex flex-wrap gap-4 px-4 py-1">
                                <div className="flex items-center justify-center gap-2 px-2 py-1">
                                    <div className="text-[#93adc8]" data-icon="ThumbsUp" data-size="20px" data-weight="regular">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                                            <path
                                                d="M234,80.12A24,24,0,0,0,216,72H160V56a40,40,0,0,0-40-40,8,8,0,0,0-7.16,4.42L75.06,96H32a16,16,0,0,0-16,16v88a16,16,0,0,0,16,16H204a24,24,0,0,0,23.82-21l12-96A24,24,0,0,0,234,80.12ZM32,112H72v88H32ZM223.94,97l-12,96a8,8,0,0,1-7.94,7H88V105.89l36.71-73.43A24,24,0,0,1,144,56V80a8,8,0,0,0,8,8h64a8,8,0,0,1,7.94,9Z"
                                            ></path>
                                        </svg>
                                    </div>
                                    <p className="text-[#93adc8] text-[12px] font-bold leading-normal tracking-[0.015em]">{reply.likes}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
