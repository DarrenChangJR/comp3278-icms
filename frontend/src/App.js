import { Box } from '@mui/material'
import SideBar from './components/SideBar'
import Calendar from './components/Calendar'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './auth/useAuth'

const App = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [classTimes, setClassTimes] = useState(false)
  const [studentInfo, setStudentInfo] = useState()
  const { loggedIn } = useAuth()
  const navigate = useNavigate()

  const processStudentInfo = (data) => {
    setStudentInfo({
      name: data.name,
      last_login: data.last_login,
    })
    // 1st dimension: time slots (30 mins each)
    // 2nd dimension: days of the week (Monday to Sunday)
    // const class_times = []
    const class_times = new Array(48)
    for (let i = 0; i < 48; i++) {
      class_times[i] = new Array(7).fill(null)
    }

    data.courses.forEach((course) => {
      const { code, course_name, moodle_link, staffs, classes, notes } = course
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

        if (!Array.isArray(class_times[start_slot][day])) {
          class_times[start_slot][day] = []
        }

        class_times[start_slot][day].push({
          code,
          course_name,
          moodle_link,
          staffs,
          slot_length: end_slot - start_slot,
          notes,
          ...class_,
        })
      })
    })

    setClassTimes(class_times)
  }

  // Redirect to login page if not logged in
  useEffect(() => {
    if (!loggedIn) {
      navigate('/login')
    } else {
      const token = localStorage.getItem('access_token')
      fetch(`http://localhost:8000/student/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error('Network response was not ok')
          }
          return res.json()
        })
        .then((res) => {
          processStudentInfo(res)
        })
        .catch((error) => {
          console.error('Error fetching classes:', error)
        })

      const intervalId = setInterval(() => {
        fetch('http://localhost:8000/ping', {
          method: 'HEAD',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).catch((error) => {
          console.error('Error sending ping:', error)
        })
      }, 60000)

      return () => {
        clearInterval(intervalId)
      }
    }
  }, [loggedIn, navigate])

  return (
    classTimes && (
      <Box display="flex">
        <SideBar
          drawerOpen={drawerOpen}
          handleClose={() => setDrawerOpen(false)}
          studentInfo={studentInfo}
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
