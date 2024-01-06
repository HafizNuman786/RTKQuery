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
} from '@mui/material';
import { useSelector } from 'react-redux';
import { useCreateNoteMutation, useDeleteNoteMutation, useGetNoteByIdQuery, useGetNotesQuery, useUpdateNoteMutation } from './api/notesApi';
import { selectUserEmail } from './api/userSlice';
import Router from 'next/router';
const Notes = () => {

  const [createNote] = useCreateNoteMutation();
  const [updateNote] = useUpdateNoteMutation();
  const [deleteNote] = useDeleteNoteMutation();
  const [heading, setHeading] = useState('');
  const [description, setDescription] = useState('');
  const userEmail = useSelector(selectUserEmail);
  const { isLoading, isError, isSuccess, data, error } = useGetNotesQuery();


  let userNotes = [];
  if (isSuccess) {
    // Find the user object associated with the user's email
    const allNotes = data.filter((item) => item.email === userEmail);

    // If user object is found, extract the notes array
    if (allNotes) {
      userNotes = allNotes;
      console.log("User Notes:", userNotes);
    }
  }
  //to generate a unique id everytime
  function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }


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

  const handleUpdateNote = async (id) => {
    const updatedHeading = prompt('Enter updated heading:');
    const updatedDescription = prompt('Enter updated description:');

    if (updatedHeading !== null && updatedDescription !== null) {
      const updatedNote = { email: userEmail, heading: updatedHeading, description: updatedDescription };
      await updateNote({ id, ...updatedNote });
    }

  };

  const handleDeleteNote = async (id) => {
    await deleteNote(id);
  };

  
  const handleLogout = () => {

    Router.push("/");
  }



  return (
    <Grid container spacing={2}
      sx={{
        width: '100vw',
        height: '100vh',
        backgroundImage: 'url("/ntsticky.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '20px',

      }}
    >

      <Grid item xs={12} md={6} >
        <Paper sx={{ textAlign: "center", width: "100%", marginLeft: "20px" }}>
          <Typography sx={{ paddingTop: "20px", color:"#e74c3c" }} variant="h5">Add Note</Typography>
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

         <div> <Button
            color="primary"
            onClick={handleLogout}
            sx={{
              width:"50%",
              fontWeight: "bold",
              fontSize: "16px",
              marginBottom:"20px",
              backgroundColor:"#ed7669",
              textTransform: "none", // Prevent uppercase transformation
              "&:hover": {
                backgroundColor: "#e74c3c", // Custom hover color
              },
            }}
          >
            Logout
          </Button></div>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ width: "95%", height: "90vh", marginLeft: "20px", overflowY: "auto" }}>
          <Typography sx={{ textAlign: "center", paddingTop: "20px",color:"#e74c3c" }} variant="h5">Notes List</Typography>
          <div>
            {isSuccess ? userNotes?.map((note) => (
              <Card key={note.id} style={{ margin: '10px' }}>
                <CardContent>
                  <Typography variant="h6">{note.heading}</Typography>
                  <Typography>{note.description}</Typography>
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={() => handleUpdateNote(note.id)}
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
    </Grid>
  );
};

export default Notes;
