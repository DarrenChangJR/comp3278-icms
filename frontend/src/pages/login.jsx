import {
  Box,
  Button,
  Card,
  Container,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { Link } from 'react-router-dom'
import FaceIcon from '@mui/icons-material/Face'

const Login = () => {
  const { breakpoints } = useTheme()
  const isMobile = useMediaQuery(breakpoints.down('md'))

  return (
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

        <Box display="flex" flexDirection="column" gap={2}>
          {/* <TextField label="Email" variant="outlined" type="email" />
          <TextField label="Password" variant="outlined" type="password" />
          <Button component={Link} to="/" variant="contained">
            <Typography>Login</Typography>
          </Button> */}
          <Button
            component={Link}
            to="/"
            variant="contained"
            startIcon={<FaceIcon />}
            sx={{ py: 1 }}
          >
            <Typography>Face Login</Typography>
          </Button>
        </Box>
      </Card>
    </Container>
  )
}

export default Login
