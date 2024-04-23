import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button, TextField, Avatar, Menu, MenuItem, IconButton,
  Box, CssBaseline, Typography, Container, Snackbar, Alert
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { getAuth } from 'firebase/auth'; // Import getAuth for Firebase authentication

const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6', 
    },
    secondary: {
      main: '#19857b', 
    },
    error: {
      main: '#ff1744',
    },
    background: {
      default: '#f0f0f0',
    },
  },
});

function Dashboard() {
  const [textInput, setTextInput] = useState('');
  const [responseData, setResponseData] = useState(''); // State to hold the fetched data
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('info');
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleSignOut = async () => {
    const auth = getAuth();
    try {
      await auth.signOut();
      navigate('/signin');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSubmit = async () => {
    console.log('Submitting text input:', textInput)
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      user.getIdToken().then(token => {
        fetch(`http://localhost/assistantService/assistant`, {
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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container component="main" maxWidth="xs" style={{ marginTop: '8%' }}>
        <Box sx={{ mt: 4 }}>
          <TextField
            label="TextInput"
            multiline
            maxRows={9}
            fullWidth
            variant="outlined"
            margin="normal"
            value={textInput}
            onChange={e => setTextInput(e.target.value)}
          />
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleSubmit}
          >
            Submit
          </Button>
          {responseData && (
            <Typography variant="body1" sx={{ mt: 2, mb: 2 }}>
              Response: {responseData}
            </Typography>
          )}
          <IconButton onClick={handleClick} style={{ position: 'absolute', top: 20, right: 20 }}>
            <Avatar src="/path_to_your_image.jpg"/> {/* Replace with your image path */}
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleClose}
          >
            <MenuItem onClick={() => {
              navigate('/parameters');
              handleClose();
            }}>Parameters</MenuItem>
            <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
          </Menu>
          <Button onClick={handleSignOut} variant="contained" color="secondary" sx={{ mt: 2 }}>
            Sign Out
          </Button>
          <Snackbar open={open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
            <Alert onClose={handleCloseSnackbar} severity={severity} sx={{ width: '100%' }}>
              {message}
            </Alert>
          </Snackbar>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default Dashboard;
