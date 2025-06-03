import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ChannelsCarousel from './ChannelsCarousel';
import Searchbar from './Searchbar';
import { 
    searchContent, 
    clearSearch, 
    selectSearchStatus, 
    selectSearchError 
} from '../store/features/search';

function Home() {
    const [searchQuery, setSearchQuery] = useState('');
    const dispatch = useDispatch();
    const searchStatus = useSelector(selectSearchStatus);
    const searchError = useSelector(selectSearchError);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            dispatch(searchContent(searchQuery));
        }
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        dispatch(clearSearch());
    };

    return (
        <>
            <div className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-40 flex flex-1 justify-center py-5">
                <div className="layout-content-container flex flex-col w-full max-w-[960px] flex-1">
                    <Searchbar />

                    <ChannelsCarousel />

                </div>
            </div>
        </>
    )
}

export default Home
