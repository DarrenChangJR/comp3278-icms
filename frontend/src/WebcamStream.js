import React, { useEffect, useRef } from 'react';

export default function WebcamStream({ setImageDataUrl, stopCam }) {
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

  useEffect(() => {
    if (stopCam) {
      // TODO: delete below if once login is properly implemented
      if (videoRef.current.srcObject == null) return
      const tracks = videoRef.current.srcObject.getTracks();

      tracks.forEach((track) => {
        console.log("tracKKAKK", track)
        track.stop();
      });
    }
  }, [stopCam]);

  const captureFrame = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (video === null) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageDataUrl = canvas.toDataURL('image/jpeg');

    setImageDataUrl(imageDataUrl);
  };

  return (
    <div>
      <video ref={videoRef} autoPlay />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};
