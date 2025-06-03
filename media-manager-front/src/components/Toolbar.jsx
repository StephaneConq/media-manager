import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Toolbar() {
    const location = useLocation();
    const { user } = useAuth();
    const [displayClass, setDisplayClass] = useState('hidden');

    useEffect(() => {
        const isLoginPage = location.pathname.startsWith('/login');
        const shouldDisplay = user && !isLoginPage ? '' : 'hidden';
        setDisplayClass(shouldDisplay);
    }, [location.pathname, user]);

    return (
        <>
            <header className={`flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#243647] px-4 sm:px-6 md:px-8 lg:px-10 py-3 ${displayClass}`}>
                <div className="flex items-center gap-2 sm:gap-4 text-white">
                    <div className="size-4">
                        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor"></path></svg>
                    </div>
                    <h2 className="text-white text-base sm:text-lg font-bold leading-tight tracking-[-0.015em]">Video Actions</h2>
                </div>
                <div className="flex flex-1 justify-end gap-2 sm:gap-4 md:gap-8 items-center">
                    <label className="hidden sm:flex flex-col min-w-0 sm:min-w-40 !h-10 max-w-64">
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
                                placeholder="Search"
                                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border-none bg-[#243647] focus:border-none h-full placeholder:text-[#93adc8] px-2 sm:px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                            />
                        </div>
                    </label>
                    <button
                        className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 bg-[#243647] text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5"
                    >
                        <div className="text-white" data-icon="List" data-size="20px" data-weight="regular">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                                <path
                                    d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z"
                                ></path>
                            </svg>
                        </div>
                    </button>
                    {user && (
                        <img 
                            src={user.photoURL} 
                            alt={user.displayName || "User profile"} 
                            className="rounded-full size-8 sm:size-10 object-cover"
                            referrerPolicy="no-referrer"
                        />
                    )}
                </div>
            </header>
        </>
    );
}
