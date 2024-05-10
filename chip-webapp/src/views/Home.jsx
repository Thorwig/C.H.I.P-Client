import React, { useState, useEffect } from 'react';
import { Container, Button, TextField, Typography, Box, Snackbar, Alert, IconButton } from '@mui/material';
import Header from '../components/Header';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import ImageIcon from '@mui/icons-material/Image';

function Home() {
  const [textInput, setTextInput] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcriptions, setTranscriptions] = useState([]);
  const [responseData, setResponseData] = useState('');
  const [socket, setSocket] = useState(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('info');

  useEffect(() => {
    const newSocket = new WebSocket('ws://localhost:5000/audio');
    newSocket.onopen = () => console.log("WebSocket Connected");
    newSocket.onerror = error => console.log("WebSocket Error: ", error);
    newSocket.onmessage = e => {
      const data = JSON.parse(e.data);
      setTranscriptions(prev => [...prev, data.text]);
    };
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };
  const handleStartRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const recorder = new MediaRecorder(stream);
        recorder.ondataavailable = event => {
          if (event.data.size > 0 && socket && socket.readyState === WebSocket.OPEN) {
            socket.send(event.data);
          }
        };
        recorder.start(1000);  // Collect 1000ms of data in each chunk
        setIsRecording(true);
      })
      .catch(err => {
        console.error("Error accessing microphone:", err);
        setMessage('Error accessing microphone');
        setSeverity('error');
        setOpen(true);
      });
  };

  const handleStopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };
  const handleSubmit = async () => {
    console.log('Submitting text input:', textInput)
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      user.getIdToken().then(token => {
        const formData = new FormData();
        formData.append('message', textInput);
        formData.append('image', imageFile);
        formData.append('audio', audioFile);

        fetch(`http://172.20.0.254/assistantService/assistant`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData
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
      <Header />
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
        <IconButton color="primary" component="label">
          <input type="file" hidden accept="image/*" onChange={e => setImageFile(e.target.files[0])} />
          <ImageIcon />
        </IconButton>
        <IconButton color="secondary" onClick={isRecording ? handleStopRecording : handleStartRecording}>
          {isRecording ? <MicOffIcon /> : <MicIcon />}
        </IconButton>
        {transcriptions.map((transcription, index) => (
          <Typography key={index} variant="body1" className="mt-2 mb-2">
            Transcription: {transcription}
          </Typography>
        ))}
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
