import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter
} from "react-router";
import store from './store'
import { Provider } from 'react-redux'
import Home from './components/Home';
import Login from './components/Login';
import App from './App';


const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/login",
    Component: Login,
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App
      router={router} />
    </Provider>
  </StrictMode>,
)
