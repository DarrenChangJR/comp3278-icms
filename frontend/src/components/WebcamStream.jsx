import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from '../auth/useAuth'

export default function WebcamStream() {
  const intervalId = useRef(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const { login } = useAuth()
  const [isAllowed, setIsAllowed] = useState(false)

  if (!isAllowed) {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream
        setIsAllowed(true)
      })
      .catch((error) => {
        console.error('Error accessing webcam:', error)
      })
  }

  useEffect(() => {
    intervalId.current = setInterval(sendFrame, 500)
  }, [])

  const sendFrame = async () => {
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
      .then((data) => {
        if (!data.access_token) return
        clearInterval(intervalId.current)
        const stream = videoRef.current.srcObject
        stream.getTracks().forEach((track) => {
          track.stop()
          stream.removeTrack(track)
        })
        videoRef.current.srcObject = null
        login(data.access_token)
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  }

  return (
    <div>
      <video ref={videoRef} autoPlay />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  )
}
