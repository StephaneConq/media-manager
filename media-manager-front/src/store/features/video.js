import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the base URL for your API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Create an async thunk for searching
export const getVideo = createAsyncThunk(
    'video/getVideo',
    async (videoId, { rejectWithValue }) => {
        try {
            // You can adjust the endpoint and parameters based on your API
            const response = await axios.get(`${API_BASE_URL}/api/youtube/video/${videoId}`);

            return response.data.response;
        } catch (error) {
            // Return custom error message from backend if present
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue('An error occurred while searching. Please try again.');
            }
        }
    }
);

export const updateCommentSummary = createAsyncThunk(
    'video/updateCommentSummary',
    async ({ videoId, regenerate = false }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/youtube/comments/summary/${videoId}?regenerate=${regenerate}`);
            return response.data.summary;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
)

export const pickRandomComment = ({ videoId, channels, needsSubscription = false }) => {
    return axios.get(`${API_BASE_URL}/api/youtube/comments/pick`, {
        params: {
            video_id: videoId,
            needs_subscription: needsSubscription,
            channels
        }
    });
}

export const videoSlice = createSlice({
    name: 'video',
    initialState: {
        video: null,
        comments: null,
        summary: null
    },
    reducers: {
        clearState: (state) => {
            state.video = {};
            state.comments = [];
            state.summary = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getVideo.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getVideo.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // Assuming your API returns an object with channels and videos arrays
                state.video = action.payload.video || [];
                state.comments = action.payload.comments || [];
                state.summary = action.payload.summary;
            })
            .addCase(getVideo.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Failed to search content';
            });

        builder
            .addCase(updateCommentSummary.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateCommentSummary.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.summary = action.payload;
            })
            .addCase(updateCommentSummary.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Failed to update comment summary';
            });
    },
});

// Export the synchronous actions
export const { clearState } = videoSlice.actions;

// Export selectors
export const selectVideo = (state) => state.video.video;
export const selectComments = (state) => state.video.comments;
export const selectSummary = (state) => state.video.summary;

// Export the reducer
export default videoSlice.reducer;
