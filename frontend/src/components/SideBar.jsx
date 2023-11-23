import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  IconButton,
  Divider,
  Drawer,
  Stack,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import HomeIcon from '@mui/icons-material/Home'
import LogoutIcon from '@mui/icons-material/Logout'
import LinkButton from './LinkButton'
import { useAuth } from '../auth/useAuth'

const SideBar = ({ drawerOpen, handleClose, studentInfo }) => {
  const drawerWidth = 210
  const { breakpoints } = useTheme()
  const isMobile = useMediaQuery(breakpoints.down('md'))
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  useEffect(() => {
    // Close drawer when screen size is not mobile
    if (!isMobile) {
      handleClose()
    }
  }, [isMobile])

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={isMobile ? drawerOpen : true}
      onClose={handleClose}
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
      <Stack spacing={2} px={2} py={3}>
        {isMobile && (
          // Use box to prevent IconButton from stretching
          <Box display="flex" alignItems="center">
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        )}
        <Typography variant="h4">Hello, {studentInfo.name}</Typography>
        <Typography variant="caption">
          Login Time: <br />
          {new Date(studentInfo.last_login).toLocaleDateString() +
            ' ' +
            new Date(studentInfo.last_login).toLocaleTimeString()}
        </Typography>
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
  )
}

export default SideBar
