import { Box } from '@mui/material'
import SideBar from './components/SideBar'
import Calendar from './components/Calendar'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './auth/useAuth'

const App = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [classTimes, setClassTimes] = useState(false)
  const { loggedIn } = useAuth()
  const navigate = useNavigate()

  const processStudentInfo = (data) => {
    // 1st dimension: time slots (30 mins each)
    // 2nd dimension: days of the week (Monday to Sunday)
    // const class_times = []
    const class_times = new Array(48)
    for (let i = 0; i < 48; i++) {
      class_times[i] = new Array(7).fill(null)
    }

    data.courses.forEach((course) => {
      const { code, name, classes, notes } = course
      classes.forEach((class_) => {
        const { start_time, end_time, day } = class_
        const [start_hour, start_minute] = start_time
          .split(':')
          .map((x) => parseInt(x))
        const start_slot = start_hour * 2 + start_minute / 30

        const [end_hour, end_minute] = end_time
          .split(':')
          .map((x) => parseInt(x))
        const end_slot = end_hour * 2 + end_minute / 30

        class_times[start_slot][day] = {
          code,
          name,
          slot_length: end_slot - start_slot,
          notes,
          ...class_,
        }
      })
    })

    return class_times
  }

  // Redirect to login page if not logged in
  useEffect(() => {
    if (!loggedIn) {
      navigate('/login')
    } else {
      fetch(`http://localhost:8000/student/${localStorage.getItem('access_token')}`)
        .then((res) => {
          return res.json()
        })
        .then((res) => {
          setClassTimes(processStudentInfo(res))
        })
        .catch((error) => {
          console.error('Error fetching classes:', error);
        })
    }
  }, [loggedIn, navigate])

  return (
    classTimes && (
      <Box display="flex">
        <SideBar
          drawerOpen={drawerOpen}
          handleClose={() => setDrawerOpen(false)}
        />

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
          <Calendar
            classTimes={classTimes}
            handleMenuClick={() => setDrawerOpen(!drawerOpen)}
          />
        </Box>
      </Box>
    )
  )
}

export default App
