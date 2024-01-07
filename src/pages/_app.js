// Importing global styles
import '@/styles/globals.css'

// Importing necessary packages and components
import { ApiProvider } from '@reduxjs/toolkit/query/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Importing API from usersapi file
import { notes } from './api/usersapi';

// Importing Redux Provider and store
import { Provider } from 'react-redux';
import { store } from '../store';

// Main App component
export default function App({ Component, pageProps }) {
  // Wrapping the entire application with Redux Provider
  return <Provider store={store}>
    {/* Rendering the main component and passing its props */}
    <Component {...pageProps} />

    {/* Adding a notification container for toasts */}
    <ToastContainer />
  </Provider>
}
