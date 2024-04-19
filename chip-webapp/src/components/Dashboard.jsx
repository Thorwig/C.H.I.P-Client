import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField } from '@mui/material';
import { signOut } from '../firebase/auth'; // Adjust the path as necessary

function Dashboard() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/signin');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <TextField label="TextInput" multiline maxRows={4} id="fullWidth" />
      <Button onClick={handleSignOut} variant="contained">Sign Out</Button>
    </div>
  );
}

export default Dashboard;
