import React, { useRef, useState } from 'react';
import './App.css';

function App() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('video')) {
      const videoURL = URL.createObjectURL(file);
      setVideoSrc(videoURL);
      setVideoFile(file);
      setThumbnail(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const captureThumbnail = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || !videoFile) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataURL = canvas.toDataURL('image/png');
    setThumbnail(dataURL);

    // Send data as a JSON request with base64 and filepath
    const payload = {
      videoPath: videoFile.name, // Send the video filename
      thumbnail: dataURL, // Send base64-encoded image
    };

    try {
      const response = await fetch('http://localhost:6767/thumbnail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Sending JSON
        },
        body: JSON.stringify(payload), // Send JSON body
      });

      if (response.ok) {
        alert('Thumbnail uploaded successfully!');
      } else {
        console.error('Server error:', await response.text());
        alert('Failed to upload thumbnail.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error sending request to server.');
    }
  };

  return (
    <div
      className="App"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <h2>Drag and drop an MP4 file</h2>

      {videoSrc && (
        <div>
          <video
            ref={videoRef}
            src={videoSrc}
            controls
          />
          <br />
          <button onClick={captureThumbnail}>
            Set Current Frame as Thumbnail
          </button>
        </div>
      )}

      {thumbnail && (
        <div>
          <h3>Thumbnail Preview:</h3>
          <img src={thumbnail} alt="Video thumbnail" />
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}

export default App;
