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

  return (
    <Container component="main" maxWidth="xs" className="mt-32">
      <Header />
      <Box className="mt-16">
        {/* Your existing UI elements */}
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
      </Box>
    </Container>
  );
}

export default Home;
