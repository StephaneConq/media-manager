import { selectVideo, selectSummary, updateCommentSummary } from "../store/features/video";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ReactMarkdown from 'react-markdown';
import { decodeUnicodeEscapes } from "../utils";

export default function CommentSummary() {
    const videoData = useSelector(selectVideo);
    const summary = useSelector(selectSummary);
    const [opened, setOpened] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

    // Open panel when summary is first generated
    useEffect(() => {
        if (summary && isLoading) {
            setOpened(true);
        }
    }, [summary, isLoading]);

    const handleGenerateSummary = async (regenerate = false) => {
        if (!videoData?.id) return;
        
        setIsLoading(true);
        
        try {
            await dispatch(updateCommentSummary({videoId: videoData.id, regenerate})).unwrap();
        } catch (error) {
            console.error("Failed to generate summary:", error);
        } finally {
            setIsLoading(false);
        }
    };
    
    // Common button styles
    const buttonClasses = "px-4 py-3 bg-blue-900 hover:bg-blue-800 text-white font-semibold transition-colors focus:outline-none";
    
    // If no summary is available, show the generate button
    if (!summary) {
        return (
            <div className="w-full my-4 rounded overflow-hidden shadow transition-all duration-300">
                <button 
                    className={`${buttonClasses} w-full text-center flex justify-center items-center disabled:bg-blue-700 disabled:cursor-not-allowed`}
                    onClick={() => handleGenerateSummary(false)}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generating a summary...
                        </>
                    ) : (
                        "Generate summary"
                    )}
                </button>
            </div>
        );
    }

    // If summary exists, show the toggle button and content
    return (
        <div className="w-full my-4 rounded overflow-hidden shadow transition-all duration-300">
            <div className="flex w-full">
                <button 
                    className={`${buttonClasses} text-left flex justify-between items-center w-4/5 mr-2`}
                    onClick={() => setOpened(!opened)}
                >
                    {opened ? 'Hide summary' : 'Show summary'}
                    <svg 
                        className={`w-5 h-5 transition-transform duration-300 ${opened ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </button>
                <button 
                    className={`${buttonClasses} w-1/5 flex items-center justify-center disabled:bg-blue-700 disabled:cursor-not-allowed`}
                    onClick={() => handleGenerateSummary(true)}
                    disabled={isLoading}
                    title="Regenerate summary"
                >
                    {isLoading ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                        </svg>
                    )}
                </button>
            </div>
            
            <div 
                className={`bg-blue-900 text-white overflow-hidden transition-all duration-300 ${
                    opened ? 'p-4' : 'max-h-0'
                }`}
            >
                <div className="markdown-content prose prose-invert max-w-none">
                    <ReactMarkdown>{decodeUnicodeEscapes(summary)}</ReactMarkdown>
                </div>
            </div>
        </div>
    );
}
