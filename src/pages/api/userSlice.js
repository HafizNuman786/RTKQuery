// Importing createSlice function from the toolkit
import { createSlice } from '@reduxjs/toolkit';

// Creating a userSlice using createSlice
const userSlice = createSlice({
  // Name of the slice
  name: 'user',

  // Initial state with email set to null
  initialState: { email: null },

  // Reducers to define actions and how state should be updated
  reducers: {
    // Action to set the user's email in the state
    setUserEmail: (state, action) => {
      state.email = action.payload;
    },
  },
});

// Exporting the setUserEmail action
export const { setUserEmail } = userSlice.actions;

// Selecting the user's email from the state
export const selectUserEmail = (state) => state.user.email;

// Exporting the userSlice reducer
export default userSlice.reducer;
