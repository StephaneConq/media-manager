import { createSlice } from '@reduxjs/toolkit'

export const layoutSlice = createSlice({
    name: 'layout',
    initialState: {
        isSidebarOpen: true,
    },
    reducers: {
        toggleSidebar: (state) => {
            state.isSidebarOpen = !state.isSidebarOpen;
        }
    }
});

export const { toggleSidebar } = layoutSlice.actions;

export default layoutSlice.reducer;