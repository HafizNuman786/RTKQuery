// Importing necessary functions and modules from the toolkit
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Creating an API instance for users with specified configuration
export const users = createApi({
  // Redux Toolkit reducer path
  reducerPath: 'usersApi',

  // Configuring the base query with the API base URL
  baseQuery: fetchBaseQuery({ baseUrl: 'https://apijson-ezj8.onrender.com/' }),

  // Defining API endpoints using the builder
  endpoints: (builder) => ({
    // Query to get all users
    getUsers: builder.query({
      query: () => 'users',
    }),

    // Query to get a specific user by its ID
    getUserId: builder.query({
      query: (id) => `users/${id}`,
    }),

    // Query to get a user by their email
    getUserByEmail: builder.query({
      query: (email) => `users/${email}`,
    }),

    // Mutation to create a new user
    createUser: builder.mutation({
      query: (newUser) => ({
        url: 'users',
        method: 'POST',
        body: newUser,
      }),
    }),

    // Mutation to update an existing user
    updateUser: builder.mutation({
      query: ({ id, ...updates }) => ({
        url: `users/${id}`,
        method: 'PUT',
        body: updates,
      }),
    }),

    // Mutation to delete a user by their ID
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `users/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
})

// Extracting hooks for each endpoint
export const {
  useCreateUserMutation,
  useGetUserByEmailQuery,
  useGetUsersQuery,
  useDeleteUserMutation,
  useGetUserIdQuery
} = users;
