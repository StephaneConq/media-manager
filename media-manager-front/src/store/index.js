import { configureStore } from '@reduxjs/toolkit'
import layoutReducer from './features/layout'
import searchReducer from './features/search'
import videoReducer from './features/video'
import axios from 'axios'
import { getAuth } from 'firebase/auth'


axios.interceptors.request.use(async (config) => {
  try {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      const token = await currentUser.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  } catch (error) {
    console.error('Error adding auth token to request:', error);
    return config;
  }
}, (error) => {
  return Promise.reject(error);
});

export default configureStore({
  reducer: {
    layout: layoutReducer,
    search: searchReducer,
    video: videoReducer
  }
})
