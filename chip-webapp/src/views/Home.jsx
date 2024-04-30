import React, { useState } from 'react';
import { Container, Button, TextField, Typography, Box, Snackbar, Alert } from '@mui/material';
import Header from '../components/Header'; // Import the Header component

function Home() {
  const [textInput, setTextInput] = useState('');
  const [responseData, setResponseData] = useState('');
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('info');
  const [anchorEl, setAnchorEl] = useState(null);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };
  
  const handleSubmit = async () => {
    console.log('Submitting text input:', textInput)
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      user.getIdToken().then(token => {
        fetch(`http://172.20.0.254/assistantService/assistant`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ message: textInput})
        })
        .then(response => response.text())
        .then(data => {
          setResponseData(data); // Store the fetched data
          setMessage('Request successful!');
          setSeverity('success');
          setOpen(true);
          console.log(data);
        })
        .catch(error => {
          setMessage('Request failed: ' + error.message);
          setSeverity('error');
          setOpen(true);
          console.error('Error fetching data:', error);
        });
      });
    }
  };

  return (
    <Container component="main" maxWidth="xs" className="mt-32">
      <Header anchorEl={anchorEl} setAnchorEl={setAnchorEl} />
      <Box className="mt-16">
        <TextField
          label="TextInput"
          multiline
          maxRows={9}
          fullWidth
          variant="outlined"
          margin="normal"
          value={textInput}
          onChange={e => setTextInput(e.target.value)}
          className="mb-4"
        />
        <Button
          type="button"
          fullWidth
          variant="contained"
          color="primary"
          className="mt-3 mb-2"
          onClick={handleSubmit}
        >
          Submit
        </Button>
        {responseData && (
          <Typography variant="body1" className="mt-2 mb-2">
            Response: {responseData}
          </Typography>
        )}
        <Snackbar open={open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity={severity} sx={{ width: '100%' }}>
            {message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
}

export default Home;
