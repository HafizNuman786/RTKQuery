import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const users = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({ baseUrl:'https://apijson-ezj8.onrender.com/' }),
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => 'users',
    }),
    getUserId: builder.query({
      query: (id) => `users/${id}`,
    }),
    getUserByEmail: builder.query({
      query: (email) => `users/${email}`,
    }),
    createUser: builder.mutation({
      query: (newUser) => ({
        url: 'users',
        method: 'POST',
        body: newUser,
      }),
    }),
    updateUser: builder.mutation({
      query: ({ id, ...updates }) => ({
        url: `users/${id}`,
        method: 'PUT',
        body: updates,
      }),
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `users/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
})


/**
 * 
 */


export const {useCreateUserMutation,useGetUserByEmailQuery,useGetUsersQuery,useDeleteUserMutation,useGetUserIdQuery} = users;
