import { Box } from '@mui/material'
import SideBar from './components/SideBar'
import Calendar from './components/Calendar'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './auth/useAuth'

const App = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { loggedIn } = useAuth()
  const navigate = useNavigate()

  const data = {
    student_name: 'John Doe',
    last_login: '2021-10-01 12:00:00',
    courses: [
      {
        course_code: 'COMP3278',
        course_name: 'Intro to Database',
        classes: [
          {
            class_id: 1,
            class_type: 'Lecture',
            start_time: '09:30',
            end_time: '12:20',
            day: 1, // Monday
          },
          {
            class_id: 2,
            class_type: 'Tutorial',
            start_time: '13:30',
            end_time: '14:20',
            day: 1, // Monday
          },
          {
            class_id: 3,
            class_type: 'Tutorial',
            start_time: '13:30',
            end_time: '14:20',
            day: 2, // Tuesday
          },
        ],
      },
      {
        course_code: 'COMP3330',
        course_name: 'Mobile App Development',
        classes: [
          {
            class_id: 4,
            class_type: 'Lecture',
            start_time: '09:30',
            end_time: '12:20',
            day: 2, // Tuesday
          },
          {
            class_id: 5,
            class_type: 'Tutorial',
            start_time: '09:30',
            end_time: '11:20',
            day: 3, // Wednesday
          },
        ],
      },
    ],
  }

  // 1st dimension: time slots (30 mins each)
  // 2nd dimension: days of the week (Monday to Sunday)
  // const class_times = []
  const class_times = new Array(48)
  for (let i = 0; i < 48; i++) {
    class_times[i] = new Array(7).fill(null)
  }

  data.courses.forEach((course) => {
    const { course_code, course_name, classes } = course
    course.classes.forEach((class_) => {
      const { start_time, end_time, day } = class_
      const [start_hour, start_minute] = start_time
        .split(':')
        .map((x) => parseInt(x))
      const start_slot = start_hour * 2 + start_minute / 30

      const [end_hour, end_minute] = end_time.split(':').map((x) => parseInt(x))
      const end_slot = end_hour * 2 + end_minute / 30

      class_times[start_slot][day] = {
        course_code,
        course_name,
        slot_length: end_slot - start_slot,
        ...class_,
      }
    })
  })

  // Redirect to login page if not logged in
  useEffect(() => {
    if (!loggedIn) {
      navigate('/login')
    }
  }, [loggedIn, navigate])

  return (
    loggedIn && (
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
            class_times={class_times}
            handleMenuClick={() => setDrawerOpen(!drawerOpen)}
          />
        </Box>
      </Box>
    )
  )
}

export default App
