import {
  Box,
  Button,
  Card,
  Container,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { useNavigate } from 'react-router'
import WebcamStream from '../WebcamStream'
import FaceIcon from '@mui/icons-material/Face'
import { useEffect, useState } from 'react'
import { useAuth } from '../auth/useAuth'

const Login = () => {
  const { breakpoints } = useTheme()
  const isMobile = useMediaQuery(breakpoints.down('md'))
  const [startCam, setStartCam] = useState(false)
  const [stopCam, setStopCam] = useState(false)
  const [imageDataUrl, setImageDataUrl] = useState('data:,')
  const navigate = useNavigate()
  const { loggedIn, login } = useAuth()

  // Redirect to home if logged in
  useEffect(() => {
    if (loggedIn) {
      navigate('/')
    }
  }, [loggedIn, navigate])

  useEffect(() => {
    if (imageDataUrl !== 'data:,') {
      console.log(imageDataUrl)
      // fetch('/api/upload', {
      //   method: 'POST',
      //   body: JSON.stringify({ image: imageDataUrl }),
      //   headers: { 'Content-Type': 'application/json' }
      // })
      // .then(
      // console.log('setting stopcam')
      // setStopCam(true)
      // )

      // Dummy login
      setTimeout(() => {
        login()
      }, 300)
    }
  }, [imageDataUrl, login])

  return (
    !loggedIn && (
      <Container
        sx={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Card
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 4,
            p: 4,
            boxShadow: 4,
            minWidth: isMobile ? '90%' : '70%',
            color: '#333',
          }}
        >
          <Typography variant="h3" textAlign="center">
            ICMS Login
          </Typography>

          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            gap={2}
          >
            <Button
              onClick={() => setStartCam(true)}
              variant="contained"
              startIcon={<FaceIcon />}
              sx={{ py: 1 }}
            >
              <Typography>Face Login</Typography>
            </Button>
            {startCam && (
              <Box mx="auto">
                <WebcamStream
                  setImageDataUrl={setImageDataUrl}
                  stopCam={stopCam}
                />
              </Box>
            )}
          </Box>
        </Card>
      </Container>
    )
  )
}

export default Login
