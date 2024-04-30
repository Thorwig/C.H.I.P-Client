import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Menu, MenuItem, IconButton } from '@mui/material';
import { getAuth } from 'firebase/auth'; // Import getAuth for Firebase authentication

function Header({ anchorEl, setAnchorEl }) {
  const openMenu = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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

  return (
    <div className="fixed top-0 left-0 w-full flex justify-between items-center p-4 shadow-md z-10">
      {/* Logo and Text */}
      <div className="flex items-center">
        <div className="logo mr-2">
          {/* Custom styling for cubes here */}
          <div className="w-4 h-4 bg-blue-500 inline-block"></div>
          <div className="w-4 h-4 bg-green-500 inline-block"></div>
          <div className="w-4 h-4 bg-red-500 inline-block"></div>
        </div>
        <span className="text-xl font-bold">Cleverly Humanized Intelligent Pal</span>
      </div>

      {/* Right side - Avatar and menu */}
      <div>
        <IconButton onClick={handleClick}>
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
      </div>
    </div>
  );
}

export default Header;
