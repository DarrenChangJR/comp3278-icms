import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import LinkButton from './components/LinkButton'
import HomeIcon from '@mui/icons-material/Home'
import LogoutIcon from '@mui/icons-material/Logout'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import CloseIcon from '@mui/icons-material/Close'
import MenuIcon from '@mui/icons-material/Menu'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './auth/useAuth'

const App = () => {
  const drawerWidth = 240
  const { breakpoints } = useTheme()
  const isMobile = useMediaQuery(breakpoints.down('md'))
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { loggedIn, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Redirect to login page if not logged in
  useEffect(() => {
    if (!loggedIn) {
      navigate('/login')
    }
  }, [loggedIn, navigate])

  useEffect(() => {
    // Close drawer when screen size is not mobile
    if (!isMobile) {
      setDrawerOpen(false)
    }
  }, [isMobile])

  return (
    loggedIn && (
      <Box display="flex">
        {/* Sidebar */}
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? drawerOpen : true}
          onClose={() => setDrawerOpen(false)}
          anchor="left"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              borderRadius: '0 5px 5px 0',
              boxShadow: '0 0 5px rgba(50, 50, 50, 0.5)',
            },
          }}
        >
          <Stack spacing={2} p={3}>
            {isMobile && (
              // Use box to prevent IconButton from stretching
              <Box display="flex" alignItems="center">
                <IconButton onClick={() => setDrawerOpen(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>
            )}
            <Typography variant="h4">Hello User</Typography>
            <Typography>Last Login: 2021-10-10 10:10:10</Typography>
            <Divider />
            <LinkButton
              LinkProps={{
                to: '/',
              }}
              ButtonProps={{
                startIcon: <HomeIcon />,
              }}
            >
              <Typography>Home</Typography>
            </LinkButton>
            <Button
              onClick={handleLogout}
              sx={{
                justifyContent: 'start',
                px: 2,
                py: 1,
              }}
              startIcon={<LogoutIcon />}
            >
              <Typography>Logout</Typography>
            </Button>
          </Stack>
        </Drawer>

        {/* Main content (calendar and upcoming class) */}
        <Box component={'main'} p={1} flexGrow={1}>
          <Stack
            direction="row"
            spacing={2}
            width="100%"
            justifyContent="space-between"
          >
            {isMobile && (
              <IconButton onClick={() => setDrawerOpen(!drawerOpen)}>
                <MenuIcon />
              </IconButton>
            )}
            <Button variant="outlined">
              <Typography>Today</Typography>
            </Button>
            <Stack direction="row" spacing={1} alignItems="center">
              <IconButton>
                <ChevronLeftIcon />
              </IconButton>
              <Typography variant="h6">November 2021</Typography>
              <IconButton>
                <ChevronRightIcon />
              </IconButton>
            </Stack>
            <Stack></Stack>
          </Stack>
          <Divider sx={{ my: 2 }} />
        </Box>
      </Box>
    )
  )
}

export default App
