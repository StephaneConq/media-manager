import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the base URL for your API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Create an async thunk for searching
export const searchContent = createAsyncThunk(
  'search/searchContent',
  async (searchQuery, { rejectWithValue }) => {
    try {
      // You can adjust the endpoint and parameters based on your API
      const response = await axios.get(`${API_BASE_URL}/api/youtube/search`, {
        params: { q: searchQuery }
      });
      
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

export const searchSlice = createSlice({
    name: 'search',
    initialState: {
        channels: [],
        videos: [],
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null,
    },
    reducers: {
        clearSearch: (state) => {
            state.channels = [];
            state.videos = [];
            state.status = 'idle';
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(searchContent.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(searchContent.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // Assuming your API returns an object with channels and videos arrays
                state.channels = action.payload.channels || [];
                state.videos = action.payload.videos || [];
            })
            .addCase(searchContent.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Failed to search content';
            });
    },
});

// Export the synchronous action
export const { clearSearch } = searchSlice.actions;

// Export selectors
export const selectAllChannels = (state) => state.search.channels;
export const selectAllVideos = (state) => state.search.videos;
export const selectSearchStatus = (state) => state.search.status;
export const selectSearchError = (state) => state.search.error;

// Export the reducer
export default searchSlice.reducer;
