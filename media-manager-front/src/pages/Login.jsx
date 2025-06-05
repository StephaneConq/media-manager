import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const { user, loading, signInWithGoogle } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    
    // Get the page they were trying to access (or default to home)
    const from = location.state?.from?.pathname || '/';
    
    // Redirect if user is already logged in
    useEffect(() => {
        if (user && !loading) {
            navigate(from, { replace: true });
        }
    }, [user, loading, navigate, from]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="login-container w-screen h-screen flex flex-col items-center justify-center">
            
            <div className="login-options">
                <h2>Please sign in to continue</h2>
                <button 
                    onClick={signInWithGoogle}
                    className="bg-cyan-900 text-white font-bold py-2 px-4 rounded"
                >
                    Sign in with Google
                </button>
            </div>
        </div>
    );
}
