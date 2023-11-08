import React, { useEffect, useRef } from 'react';

export default function WebcamStream() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const constraints = { video: true };

    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((error) => {
        console.error('Error accessing webcam:', error);
      });
  }, []);

  useEffect(() => {
    const intervalId = setInterval(captureFrame, 500);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const captureFrame = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageDataUrl = canvas.toDataURL('image/jpeg');

    // fetch('/api/upload', {
    //   method: 'POST',
    //   body: JSON.stringify({ image: imageDataUrl }),
    //   headers: { 'Content-Type': 'application/json' }
    // });
    console.log(imageDataUrl);
  };

  return (
    <div>
      <video ref={videoRef} autoPlay />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};
