import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    selectAllVideos,
    selectSelectedChannels
} from '../store/features/search';
import { formatDateToFrench, decodeHtmlEntities } from '../utils';

export default function Videos() {
    const videos = useSelector(selectAllVideos);
    const selectedChannels = useSelector(selectSelectedChannels);
    const navigate = useNavigate();

    // Filter videos based on selected channels
    const filteredVideos = selectedChannels.length > 0
        ? videos.filter(video => selectedChannels.includes(video.channel_id))
        : videos;

    // Handle video click to navigate to video detail page
    const handleVideoClick = (videoId) => {
        navigate(`/video/${videoId}`);
    };

    return (
        <div className="flex flex-1 justify-center py-3 sm:py-5">
            <div className="layout-content-container flex flex-col w-full max-w-[960px] px-2 sm:px-4">
                {
                    filteredVideos.map((video, index) => {
                        return (
                            <div
                                className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:px-4 sm:py-4 border-b border-gray-800 last:border-0 hover:bg-gray-800/30 transition-colors cursor-pointer rounded-lg"
                                key={index}
                                onClick={() => handleVideoClick(video.id)}
                            >
                                <div className="w-full sm:w-auto sm:min-w-[180px] md:min-w-[240px] flex-shrink-0">
                                    <img
                                        src={video.thumbnail_url}
                                        alt={`${video.title} video thumbnail`}
                                        className="w-full h-auto object-cover rounded-xl sm:rounded-2xl aspect-video"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="flex flex-1 flex-col justify-center space-y-1 sm:space-y-2">
                                    <h3 className="text-white text-base sm:text-lg font-medium leading-tight line-clamp-2">
                                        {decodeHtmlEntities(video.title)}
                                    </h3>
                                    <p className="text-[#9dadbe] text-xs sm:text-sm font-normal leading-normal line-clamp-2 sm:line-clamp-3">
                                        {video.description}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-x-2 text-[#9dadbe] text-xs sm:text-sm font-normal">
                                        <span className="font-medium">{video.channel_title}</span>
                                        <span className="hidden xs:inline">•</span>
                                        <span>{formatDateToFrench(video.published_at)}</span>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
}
