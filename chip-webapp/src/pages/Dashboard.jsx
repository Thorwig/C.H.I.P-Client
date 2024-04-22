import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Avatar, Menu, MenuItem, IconButton, Box, CssBaseline, Typography, Container } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { signOut } from '../firebase/auth'; // Adjust the path as necessary

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
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleSignOut = async () => {
    try {
      await signOut();
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
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Submit
          </Button>
          <IconButton onClick={handleClick} style={{ position: 'absolute', top: 20, right: 20 }}>
            <Avatar src="/path_to_your_image.jpg"/> {/* Replace with your image path */}
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
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
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default Dashboard;
