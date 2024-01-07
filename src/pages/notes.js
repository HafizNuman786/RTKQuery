import React, { useState } from 'react';
import {
  Grid,
  Typography,
  Paper,
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { useCreateNoteMutation, useDeleteNoteMutation, useGetNotesQuery, useUpdateNoteMutation } from './api/notesApi';
import { selectUserEmail } from './api/userSlice';
import Router from 'next/router';

const Notes = () => {
  // Hooks for managing state and handling mutations
  const [createNote] = useCreateNoteMutation();
  const [updateNote] = useUpdateNoteMutation();
  const [deleteNote] = useDeleteNoteMutation();
  const [heading, setHeading] = useState('');
  const [description, setDescription] = useState('');
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [updatedHeading, setUpdatedHeading] = useState('');
  const [updatedDescription, setUpdatedDescription] = useState('');
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  // Selecting user email from Redux state
  const userEmail = useSelector(selectUserEmail);

  // Query to get user notes
  const { isLoading, isError, isSuccess, data, error } = useGetNotesQuery();

  // Extracting user-specific notes if the query is successful
  let userNotes = [];
  if (isSuccess) {
    // Find the user object associated with the user's email
    const allNotes = data.filter((item) => item.email === userEmail);

    // If user object is found, extract the notes array
    if (allNotes) {
      userNotes = allNotes;
    }
  }

  // Function to generate a unique id every time
  function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  // Handler for creating a new note
  const handleCreateNote = async () => {
    if (heading.trim() === '' || description.trim() === '') {
      return;
    }
    const uniqueId = generateUniqueId();
    const newNote = { id: uniqueId, email: userEmail, heading, description };

    await createNote(newNote);
    setDescription('');
    setHeading('');
  };

  // Handler for opening the update dialog
  const handleOpenUpdateDialog = (id) => {
    const selectedNote = userNotes.find((note) => note.id === id);
    if (selectedNote) {
      setSelectedNoteId(id);
      setUpdatedHeading(selectedNote.heading);
      setUpdatedDescription(selectedNote.description);
      setOpenUpdateDialog(true);
    }
  };

  // Handler for closing the update dialog
  const handleCloseUpdateDialog = () => {
    setSelectedNoteId(null);
    setOpenUpdateDialog(false);
  };

  // Handler for updating a note
  const handleUpdateNote = async () => {
    const updatedNote = { email: userEmail, heading: updatedHeading, description: updatedDescription };
    await updateNote({ id: selectedNoteId, ...updatedNote });
    handleCloseUpdateDialog();
  };

  // Handler for deleting a note
  const handleDeleteNote = async (id) => {
    await deleteNote(id);
  };

  // Handler for logging out
  const handleLogout = () => {
    Router.push("/");
  };

  return (
    <Grid container spacing={2}
      sx={{
        width: '99vw',
        backgroundImage: 'url("/ntsticky.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '20px',
      }}
    >
      {/* Add Note Section */}
      <Grid item xs={12} md={6} >
        <Paper sx={{ textAlign: "center", width: "100%", marginLeft: "20px", borderTop: "5px solid #e74c3c" }}>
          <Typography sx={{ paddingTop: "20px", color: "#e74c3c" }} variant="h5">Add Note</Typography>
          <TextField
            label="Note Title"
            variant="outlined"
            margin="normal"
            sx={{ width: "50%" }}
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
          />
          <TextField
            label="Note Description"
            variant="outlined"
            margin="normal"
            sx={{ width: "70%" }}
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button variant="contained" color="primary" sx={{ marginTop: "20px", width: "50%", marginBottom: "20px" }} onClick={handleCreateNote}>
            Add Note
          </Button>

          {/* Logout Button */}
          <div>
            <Button
              color="primary"
              onClick={handleLogout}
              sx={{
                width: "50%",
                fontWeight: "bold",
                fontSize: "16px",
                marginBottom: "20px",
                backgroundColor: "#ed7669",
                textTransform: "none", // Prevent uppercase transformation
                "&:hover": {
                  backgroundColor: "#e74c3c", // Custom hover color
                },
              }}
            >
              Logout
            </Button>
          </div>
        </Paper>
      </Grid>

      {/* Notes List Section */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ width: "95%", height: "90vh", marginLeft: "20px", overflowY: "auto", borderTop: "5px solid #e74c3c" }}>
          <Typography sx={{ textAlign: "center", paddingTop: "20px", color: "#e74c3c" }} variant="h5">Notes List</Typography>
          <div>
            {isSuccess ? userNotes?.map((note) => (
              <Card key={note.id} style={{ margin: '10px', borderLeft: "1px solid #e74c3c", borderRight: "1px solid #e74c3c" }}>
                <CardContent>
                  <Typography variant="h6">{note.heading}</Typography>
                  <Typography>{note.description}</Typography>
                </CardContent>
                <CardActions>
                  {/* Update and Delete Buttons */}
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={() => handleOpenUpdateDialog(note.id)}
                  >
                    Update
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={() => handleDeleteNote(note.id)}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            ))
              : (
                <Typography variant="body2" color="textSecondary">
                  Loading notes...
                </Typography>
              )
            }
          </div>
        </Paper>
      </Grid>

      {/* Update Dialog */}
      <Dialog open={openUpdateDialog} onClose={handleCloseUpdateDialog} >
        <DialogTitle>Update Note</DialogTitle>
        <DialogContent>
          {/* Fields for updating note */}
          <TextField
            label="Updated Note Title"
            variant="outlined"
            margin="normal"
            fullWidth
            value={updatedHeading}
            onChange={(e) => setUpdatedHeading(e.target.value)}
          />
          <TextField
            label="Updated Note Description"
            variant="outlined"
            margin="normal"
            fullWidth
            multiline
            rows={4}
            value={updatedDescription}
            onChange={(e) => setUpdatedDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          {/* Update Button */}
          <Button onClick={handleUpdateNote} color="primary">
            Update
          </Button>
          {/* Cancel Button */}
          <Button onClick={handleCloseUpdateDialog} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default Notes;
