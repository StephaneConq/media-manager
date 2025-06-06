import { useState, useEffect } from "react";
import { formatDateToFrench, decodeHtmlEntities } from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import { selectVideo, queryChannels, pickRandomComment } from "../../store/features/video";

export default function RandomCommentDialog({ setIsDialogOpen }) {
    const [needsSubscription, setNeedsSubscription] = useState(false);
    const [randomComment, setRandomComment] = useState(null);
    const [pickingComment, setPickingComment] = useState(false);
    const videoData = useSelector(selectVideo);

    // Channel search states
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedChannels, setSelectedChannels] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    // Add current video's channel when subscription is toggled on
    const handleSubscriptionToggle = () => {
        const newValue = !needsSubscription;
        setNeedsSubscription(newValue);

        if (newValue && !selectedChannels.some(c => c.id === videoData.channel_id)) {
            setSelectedChannels(prev => [...prev, {
                id: videoData.channel_id,
                title: videoData.channel_title,
            }]);
        }
    };

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery.trim() && needsSubscription) {
                searchChannels(searchQuery);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const searchChannels = async (query) => {
        if (!query.trim()) return;

        setIsSearching(true);
        try {
            const response = await queryChannels({ query });

            setSearchResults(response.data.response.channels || []);
        } catch (error) {
            console.error('Error searching channels:', error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSelectChannel = (channel) => {
        // Check if channel is already selected
        if (!selectedChannels.some(c => c.id === channel.id)) {
            setSelectedChannels([...selectedChannels, channel]);
        }
        // Clear search results and query
        setSearchResults([]);
        setSearchQuery("");
    };

    const handleRemoveChannel = (channelId) => {
        setSelectedChannels(selectedChannels.filter(channel => channel.id !== channelId));
    };

    const handlePickRandomComment = async () => {
        setPickingComment(true);
        setRandomComment(null);

        try {
            const channelIds = needsSubscription
                ? selectedChannels.map(channel => channel.id)
                : [videoData.channel_id];

            const response = await pickRandomComment({
                videoId: videoData.id,
                needsSubscription,
                channels: channelIds
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
                                    onChange={handleSubscriptionToggle}
                                />
                                <div className={`block w-14 h-8 rounded-full ${needsSubscription ? 'bg-blue-600' : 'bg-gray-600'}`}></div>
                                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${needsSubscription ? 'transform translate-x-6' : ''}`}></div>
                            </div>
                            <div className="ml-3 text-white font-medium">
                                Only subscribers
                            </div>
                        </label>
                    </div>

                    {needsSubscription && (
                        <div className="mb-6">
                            <p className="block text-white text-sm font-medium mb-2">
                                Select channels to check for subscribers
                            </p>

                            {/* Channel search input */}
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search for channels..."
                                    className="w-full p-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {isSearching && (
                                    <div className="absolute right-3 top-2.5">
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    </div>
                                )}
                            </div>

                            {/* Search results dropdown */}
                            {searchResults.map(channel => (
                                <div
                                    key={channel.id}
                                    className="p-2 hover:bg-gray-600 cursor-pointer flex items-center"
                                    onClick={() => handleSelectChannel(channel)}
                                >
                                    {channel.thumbnail_url && (
                                        <img
                                            src={channel.thumbnail_url}
                                            alt={channel.title}
                                            className="w-8 h-8 rounded-full mr-2"
                                        />
                                    )}
                                    <span className="text-white">{channel.title}</span>
                                </div>
                            ))}

                            {/* Selected channels */}
                            <div className="flex flex-wrap flex-row gap-2 my-3">
                                {selectedChannels.map(channel => (
                                    <div
                                        key={channel.id}
                                        className="bg-gray-700 w-fit text-white px-3 py-1 rounded-full flex items-center text-sm"
                                    >
                                        {channel.thumbnail_url && (
                                            <img
                                                src={channel.thumbnail_url}
                                                alt={channel.title}
                                                className="w-5 h-5 rounded-full mr-1"
                                            />
                                        )}
                                        <span>{channel.title}</span>
                                        <button
                                            onClick={() => handleRemoveChannel(channel.id)}
                                            className="ml-2 text-gray-400 hover:text-white"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {needsSubscription && selectedChannels.length === 0 && (
                                <p className="text-yellow-400 text-sm mt-2">
                                    Please select at least one channel to check for subscribers
                                </p>
                            )}
                        </div>
                    )}

                    <div className="flex justify-between">
                        <button
                            onClick={() => setIsDialogOpen(false)}
                            className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handlePickRandomComment}
                            disabled={pickingComment || (needsSubscription && selectedChannels.length === 0)}
                            className={`bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors ${(pickingComment || (needsSubscription && selectedChannels.length === 0))
                                ? 'opacity-70 cursor-not-allowed'
                                : ''
                                }`}
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
