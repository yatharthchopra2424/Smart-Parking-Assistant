import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import './Reports.css'; // Import the CSS file

function Reports() {
  const videoRef = useRef(null);
  const [freeSpaces, setFreeSpaces] = useState(0);
  const [processedImage, setProcessedImage] = useState(null);
  const socket = io('http://localhost:5003', { origins: ['http://localhost:517'] });

  const resetState = () => {
    setFreeSpaces(0);
    setProcessedImage(null);
  };

  useEffect(() => {
    resetState(); // Reset the state when the component is opened
  
    navigator.mediaDevices.getUserMedia({ 
      video: { 
        width: { exact: 1100 },  // Replace with the width you want
        height: { exact: 720 }  // Replace with the height you want
      } 
    })
    .then(stream => {
      videoRef.current.srcObject = stream;
    });

    socket.on('free spaces', data => {
      console.log(data.freeSpaces); // Log the number of free spaces received from the server
      setFreeSpaces(data.freeSpaces);
      setProcessedImage(`data:image/jpeg;base64,${data.image}`);
    });

    const interval = setInterval(() => {
      if (videoRef.current) {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        canvas.getContext('2d').drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        socket.emit('video frame', { frame: dataUrl.split(',')[1] });
      }
    }, 100); // Send a frame every 5 seconds

    return () => {
      clearInterval(interval); // Clean up on unmount
      socket.off('free spaces');
    };
  }, []); // Empty dependency array to run the effect only once

  return (
    <div className="reports-container">
      <video ref={videoRef} autoPlay className="video-cam" />
      {processedImage && <img src={processedImage} alt="Processed" className="processed-cam" />}
      <h1 className="free-space-text">Free Parking Spaces: {freeSpaces}</h1>
    </div>
  );
}

export default Reports;