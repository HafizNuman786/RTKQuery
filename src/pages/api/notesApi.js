import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const notes = createApi({
    reducerPath: 'notesApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://apijson-ezj8.onrender.com/' }),
    tagTypes: ['Notes'],
    endpoints: (builder) => ({
      getNotes: builder.query({
        query: () => 'notes',
        providesTags:["Notes"] 
      }),
      getNoteById: builder.query({
        query: (id) => `notes/${id}`,
      }),
      createNote: builder.mutation({
        query: (newNote) => ({
          url: 'notes',
          method: 'POST',
          body: newNote,
        }),
        invalidatesTags:["Notes"],
      }),
      updateNote: builder.mutation({
        query: ({ id, ...updates }) => ({
          url: `notes/${id}`,
          method: 'PUT',
          body: updates,
        }),
        invalidatesTags:["Notes"]
      }), 
      deleteNote: builder.mutation({
        query: (id) => ({
          url: `notes/${id}`, // Assuming email is required for the delete operation
          method: 'DELETE',
        }),
        invalidatesTags:["Notes"]
      }), 
    }),
  });

  export const {useGetNotesQuery, useCreateNoteMutation, useUpdateNoteMutation, useGetNoteByIdQuery, useDeleteNoteMutation} = notes;
