import {
  Box,
  Button,
  Divider,
  Drawer,
  Grid,
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
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './auth/useAuth'
import dayjs from 'dayjs'

const App = () => {
  const drawerWidth = 210
  const { breakpoints } = useTheme()
  const isMobile = useMediaQuery(breakpoints.down('md'))
  const { loggedIn, logout } = useAuth()
  const navigate = useNavigate()
  const { palette } = useTheme()

  const now = useMemo(() => dayjs(), [])
  const [selectedDate, setSelectedDate] = useState(now)
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Function to scroll to calendar marker
  const scrollToMarker = () => {
    const marker = document.getElementById('calendar-marker')
    if (marker) {
      marker.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      })
    }
  }

  const handleLeftClick = () => {
    setSelectedDate((prev) => prev.subtract(1, 'week'))
  }

  const handleRightClick = () => {
    setSelectedDate((prev) => prev.add(1, 'week'))
  }

  const handleTodayClick = () => {
    setSelectedDate(dayjs())
    scrollToMarker()
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Scroll to calendar marker when component is mounted
  useEffect(() => {
    scrollToMarker()
  }, [])

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
          <Stack spacing={2} px={2} py={3}>
            {isMobile && (
              // Use box to prevent IconButton from stretching
              <Box display="flex" alignItems="center">
                <IconButton onClick={() => setDrawerOpen(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>
            )}
            <Typography variant="h4">
              Hello User
            </Typography>
            <Typography variant="caption">
              Last Login: 11/12/2024 12:00
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

        {/* Main content (calendar and upcoming class) */}
        <Box
          component={'main'}
          flexGrow={1}
          height="100vh"
          boxSizing="border-box"
          p={2}
          maxWidth="xl"
          mx="auto"
        >
          {/* Calendar */}
          <Stack height="100%" boxSizing="border-box">
            {/* Calendar header */}
            <Stack
              id="calendar-header"
              direction="row"
              boxSizing="border-box"
              justifyContent="space-between"
              alignItems="center"
              bgcolor="#f8f8f8"
              border={1}
              borderColor={'divider'}
              p={2}
              borderRadius="10px 10px 0 0"
            >
              {isMobile && (
                <IconButton>
                  <MenuIcon onClick={() => setDrawerOpen(true)} />
                </IconButton>
              )}
              <Typography variant="h6">
                {selectedDate.startOf('week').format('MMM') !==
                  selectedDate.endOf('week').format('MMM') &&
                  selectedDate.startOf('week').format('MMM - ')}
                {selectedDate.endOf('week').format('MMM YYYY')}
              </Typography>
              <Stack direction="row" spacing={2}>
                <IconButton onClick={handleLeftClick}>
                  <ChevronLeftIcon />
                </IconButton>
                <IconButton onClick={handleRightClick}>
                  <ChevronRightIcon />
                </IconButton>
                <Button variant="contained" onClick={handleTodayClick}>
                  <Typography>Today</Typography>
                </Button>
              </Stack>
            </Stack>

            {/* Calendar body */}
            <Stack
              height="100%"
              overflow="scroll"
              border={1}
              borderTop={0}
              borderRadius="0 0 10px 10px"
              borderColor="divider"
            >
              {/* Dates */}
              <Grid
                container
                columns={15}
                position="sticky"
                top={0}
                height="56px"
                bgcolor="white"
                boxShadow={1}
                zIndex={1}
              >
                <Grid
                  item
                  xs={1}
                  borderRight={1}
                  borderColor="divider"
                  height="56px"
                ></Grid>
                {new Array(7).fill(0).map((_, i) => {
                  const date = selectedDate.startOf('week').add(i, 'day')
                  const isToday = date.isSame(dayjs(), 'day')
                  return (
                    <Grid
                      key={i}
                      item
                      xs={2}
                      borderRight={i === 6 ? 0 : 1}
                      borderColor="divider"
                    >
                      <Stack
                        height="100%"
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        spacing={2}
                      >
                        <Typography
                          variant="body2"
                          color={isToday ? palette.primary.main : 'gray'}
                        >
                          {selectedDate
                            .startOf('week')
                            .add(i, 'day')
                            .format('ddd')}
                        </Typography>

                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          color={isToday ? palette.primary.main : 'gray'}
                        >
                          {date.format('D')}
                        </Typography>
                      </Stack>
                    </Grid>
                  )
                })}
              </Grid>

              {/* Slots */}
              <Stack>
                {new Array(49).fill(0).map((_, i) => {
                  return (
                    <Grid
                      position="relative"
                      key={i}
                      container
                      columns={15}
                      height={i === 0 ? '28px' : '56px'}
                    >
                      <Grid
                        item
                        xs={1}
                        borderRight={1}
                        borderColor="divider"
                        height="100%"
                        position="relative"
                      >
                        <Typography
                          position="absolute"
                          color="gray"
                          variant="caption"
                          bottom={-10}
                          right={4}
                        >
                          {dayjs()
                            .startOf('day')
                            .add(i / 2, 'hour')
                            .format('HH:mm')}
                        </Typography>
                      </Grid>
                      {new Array(7).fill(0).map((_, day) => {
                        return (
                          <Grid
                            position="relative"
                            key={day}
                            item
                            xs={2}
                            height="100%"
                            borderRight={day === 6 ? 0 : 1}
                            borderBottom={1}
                            borderColor="divider"
                          >
                            {/* Marker */}
                            {now.day() === day && now.hour() * 2 === i - 2 && (
                              <Box
                                id="calendar-marker"
                                position="absolute"
                                top={`calc(56px * ${(now.minute() - 30) / 30})`}
                                pointerEvents="none"
                                width="90%"
                                height="2px"
                                bgcolor="red"
                                sx={{
                                  ':before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: '-4px',
                                    left: '-4px',
                                    width: '10px',
                                    height: '10px',
                                    borderRadius: '50%',
                                    backgroundColor: 'red',
                                  },
                                }}
                              />
                            )}
                          </Grid>
                        )
                      })}
                    </Grid>
                  )
                })}
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </Box>
    )
  )
}

export default App
