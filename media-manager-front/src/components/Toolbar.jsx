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
