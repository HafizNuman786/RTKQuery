import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react';

// Import API slices
import { notes } from './pages/api/notesApi';
import { users } from './pages/api/usersapi';

// Import userSlice for managing user related state
import userSlice from './pages/api/userSlice';

// Configure Redux store with API slices and userSlice
export const store = configureStore({
  reducer: {
    // Include userSlice in the root reducer
    user: userSlice,

    // Include notes and users API slices in the root reducer
    [users.reducerPath]: users.reducer,
    [notes.reducerPath]: notes.reducer,
  },

  // Middleware setup for API slices
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(users.middleware, notes.middleware),
});

// Set up listeners for API slice actions
setupListeners(store.dispatch);
