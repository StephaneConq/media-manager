import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    selectAllChannels,
    selectSelectedChannels,
    toggleChannelSelection
} from '../store/features/search';

export default function ChannelsCarousel() {
    // Use useSelector to access the channels from the Redux store
    const channels = useSelector(selectAllChannels);
    const selectedChannels = useSelector(selectSelectedChannels);
    const dispatch = useDispatch();

    // Function to handle image loading errors
    const handleImageError = (event, channelTitle) => {
        // Set a default placeholder image when the original fails to load
        event.target.onerror = null; // Prevent infinite error loop
        event.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(channelTitle)}&background=random&color=fff&size=128`;
    };

    // Function to handle channel selection
    const handleChannelClick = (channelId) => {
        dispatch(toggleChannelSelection(channelId));
    };

    return (
        <div className="w-full">
            <div className="overflow-x-auto overflow-y-hidden [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex items-stretch p-2 sm:p-4 gap-4 sm:gap-8 min-w-max">
                    {
                        channels.map((channel, index) => {
                            const channelTitle = channel.title || channel.name || 'Channel';
                            const thumbnailUrl = channel.thumbnail_url || channel.thumbnail || channel.profilePicture;
                            const channelId = channel.id || index;
                            const isSelected = selectedChannels.includes(channelId);

                            return (
                                <div 
                                    key={channelId} 
                                    className={`flex p-6 h-full flex-col gap-2 sm:gap-4 text-center rounded-lg min-w-24 sm:min-w-32 pt-2 sm:pt-4 cursor-pointer transition-colors ${isSelected ? 'bg-blue-700/30' : 'hover:bg-gray-800/30'}`}
                                    onClick={() => handleChannelClick(channelId)}
                                >
                                    <div className={`w-24 h-24 sm:w-32 sm:h-32 mx-auto rounded-full overflow-hidden ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
                                        <img
                                            src={thumbnailUrl}
                                            alt={`${channelTitle} channel thumbnail`}
                                            className="w-full h-full object-cover"
                                            onError={(e) => handleImageError(e, channelTitle)}
                                        />
                                    </div>
                                    <p className="text-white text-base font-medium leading-normal truncate max-w-24 sm:max-w-32 mx-auto">{channelTitle}</p>
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        </div>
    )
}
