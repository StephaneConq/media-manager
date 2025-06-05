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
        selectedChannels: [], // Add this to track selected channels
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null,
    },
    reducers: {
        clearSearch: (state) => {
            state.channels = [];
            state.videos = [];
            state.selectedChannels = [];
            state.status = 'idle';
            state.error = null;
        },
        toggleChannelSelection: (state, action) => {
            const channelId = action.payload;
            const index = state.selectedChannels.indexOf(channelId);
            
            if (index === -1) {
                // Add channel to selection
                state.selectedChannels.push(channelId);
            } else {
                // Remove channel from selection
                state.selectedChannels.splice(index, 1);
            }
        },
        clearChannelSelection: (state) => {
            state.selectedChannels = [];
        }
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
                state.selectedChannels = []; // Reset selected channels on new search
            })
            .addCase(searchContent.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Failed to search content';
            });
    },
});

// Export the synchronous actions
export const { clearSearch, toggleChannelSelection, clearChannelSelection } = searchSlice.actions;

// Export selectors
export const selectAllChannels = (state) => state.search.channels;
export const selectAllVideos = (state) => state.search.videos;
export const selectSelectedChannels = (state) => state.search.selectedChannels;
export const selectSearchStatus = (state) => state.search.status;
export const selectSearchError = (state) => state.search.error;

// Export the reducer
export default searchSlice.reducer;
