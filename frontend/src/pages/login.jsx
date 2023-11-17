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
import WebcamStream from '../components/WebcamStream'
import FaceIcon from '@mui/icons-material/Face'
import { useEffect, useState } from 'react'
import { useAuth } from '../auth/useAuth'

const Login = () => {
  const { breakpoints } = useTheme()
  const isMobile = useMediaQuery(breakpoints.down('md'))
  const [startCam, setStartCam] = useState(false)
  const navigate = useNavigate()
  const { loggedIn } = useAuth()

  // Redirect to home if logged in
  useEffect(() => {
    if (loggedIn) {
      setStartCam(false)
      navigate('/')
    }
  }, [loggedIn, navigate])

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
                <WebcamStream />
              </Box>
            )}
          </Box>
        </Card>
      </Container>
    )
  )
}

export default Login
