import { configureStore } from '@reduxjs/toolkit'
import layoutReducer from './features/layout'
import searchReducer from './features/search'
import videoReducer from './features/video'

export default configureStore({
  reducer: {
    layout: layoutReducer,
    search: searchReducer,
    video: videoReducer
  }
})
