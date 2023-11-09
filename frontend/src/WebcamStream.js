import React, { useEffect, useRef } from 'react'
import { useAuth } from './auth/useAuth'

export default function WebcamStream() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const { login } = useAuth()

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream
        const intervalId = setInterval(sendFrame, 500)
        return () => {
          clearInterval(intervalId)
        }
      })
      .catch((error) => {
        console.error('Error accessing webcam:', error)
      })
  }, [])

  const sendFrame = () => {
    const canvas = canvasRef.current
    const video = videoRef.current

    if (video === null) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)

    const imageDataUrl = canvas.toDataURL('image/jpeg')

    if (imageDataUrl === 'data:,') return

    fetch('http://localhost:8000/login', {
      method: 'POST',
      body: JSON.stringify({ image_data: imageDataUrl }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => {
        return res.json()
      })
      .then((res) => {
        const tracks = videoRef.current.srcObject.getTracks()
        tracks.forEach((track) => track.stop())
        login(res.access_token)
      })
  }

  return (
    <div>
      <video ref={videoRef} autoPlay />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  )
}
