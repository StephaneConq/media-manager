import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ChannelsCarousel from './ChannelsCarousel';
import {
    searchContent,
    clearSearch,
    selectSearchStatus,
    selectSearchError
} from '../store/features/search';

export default function Searchbar() {
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
            <div className="px-2 sm:px-4 py-3">
                <form onSubmit={handleSearch} className="flex flex-col w-full h-12">
                    <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
                        <div
                            className="text-[#93adc8] flex border-none bg-[#243647] items-center justify-center pl-2 sm:pl-4 rounded-l-xl border-r-0"
                            data-icon="MagnifyingGlass"
                            data-size="24px"
                            data-weight="regular"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                                <path
                                    d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"
                                ></path>
                            </svg>
                        </div>
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search videos or channels"
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border-none bg-[#243647] focus:border-none h-full placeholder:text-[#93adc8] px-2 sm:px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={handleClearSearch}
                                className="flex items-center justify-center bg-[#243647] px-2 rounded-r-xl"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="#93adc8" viewBox="0 0 256 256">
                                    <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
                                </svg>
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {searchStatus === 'loading' && (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                </div>
            )}

            {searchStatus === 'failed' && (
                <div className="text-red-500 text-center py-4">
                    {searchError}
                </div>
            )}
        </>
    )

}