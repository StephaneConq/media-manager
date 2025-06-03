import { configureStore } from '@reduxjs/toolkit'
import layoutReducer from './features/layout'
import searchReducer from './features/search'

export default configureStore({
  reducer: {
    layout: layoutReducer,
    search: searchReducer,
  }
})
