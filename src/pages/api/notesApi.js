// Importing necessary functions and modules from the toolkit
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Creating an API instance for notes with specified configuration
export const notes = createApi({
  // Redux Toolkit reducer path
  reducerPath: 'notesApi',

  // Configuring the base query with the API base URL
  baseQuery: fetchBaseQuery({ baseUrl: 'https://apijson-ezj8.onrender.com/' }),

  // Defining tag types to manage caching
  tagTypes: ['Notes'],

  // Defining API endpoints using the builder
  endpoints: (builder) => ({
    // Query to get all notes
    getNotes: builder.query({
      query: () => 'notes',
      providesTags: ["Notes"] // Tags for caching
    }),

    // Query to get a specific note by its ID
    getNoteById: builder.query({
      query: (id) => `notes/${id}`,
    }),

    // Mutation to create a new note
    createNote: builder.mutation({
      query: (newNote) => ({
        url: 'notes',
        method: 'POST',
        body: newNote,
      }),
      invalidatesTags: ["Notes"], // Invalidating cache tags
    }),

    // Mutation to update an existing note
    updateNote: builder.mutation({
      query: ({ id, ...updates }) => ({
        url: `notes/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: ["Notes"], // Invalidating cache tags
    }),

    // Mutation to delete a note by its ID
    deleteNote: builder.mutation({
      query: (id) => ({
        url: `notes/${id}`, // Assuming email is required for the delete operation
        method: 'DELETE',
      }),
      invalidatesTags: ["Notes"], // Invalidating cache tags
    }),
  }),
});

// Extracting hooks for each endpoint
export const { useGetNotesQuery, useCreateNoteMutation, useUpdateNoteMutation, useGetNoteByIdQuery, useDeleteNoteMutation } = notes;
