import { useState, useEffect, useMemo } from 'react'
import {
  Box,
  Button,
  Grid,
  IconButton,
  Stack,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import ClassCard from './ClassCard'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import MenuIcon from '@mui/icons-material/Menu'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'

dayjs.extend(isBetween)

const Calendar = ({ classTimes, handleMenuClick }) => {
  const { breakpoints, palette } = useTheme()
  const isMobile = useMediaQuery(breakpoints.down('md'))
  const now = useMemo(() => dayjs(), [])
  const [selectedDate, setSelectedDate] = useState(now)

  const handleShouldOpen = (class_) => {
    // Parse the start and end times to create dayjs objects
    const classStartTime = dayjs()
      .set('hour', parseInt(class_.start_time.split(':')[0]))
      .set('minute', parseInt(class_.start_time.split(':')[1]))
    const classEndTime = dayjs()
      .set('hour', parseInt(class_.end_time.split(':')[0]))
      .set('minute', parseInt(class_.end_time.split(':')[1]))

    // Get the current time
    const now = dayjs()

    // Check if the current time is within 1 hour of the start time or if the class is currently ongoing
    return now.isBetween(classStartTime.subtract(1, 'hour'), classEndTime)
  }

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

  // Scroll to calendar marker when component is mounted
  useEffect(() => {
    scrollToMarker()
  }, [])

  const handleLeftClick = () => {
    setSelectedDate((prev) => prev.subtract(1, 'week'))
  }

  const handleRightClick = () => {
    setSelectedDate((prev) => prev.add(1, 'week'))
  }

  const handleTodayClick = () => {
    setSelectedDate(now)
    scrollToMarker()
  }

  return (
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
          <IconButton onClick={handleMenuClick}>
            <MenuIcon />
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
          zIndex={1000}
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
                    {selectedDate.startOf('week').add(i, 'day').format('ddd')}
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
                          zIndex={100}
                          top={`calc(56px * ${(now.minute() - 30) / 30})`}
                          pointerEvents="none"
                          width="90%"
                          height="2px"
                          bgcolor="red"
                          visibility={
                            now.isSame(selectedDate) ? 'visible' : 'hidden'
                          }
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

                      {/* Class card */}
                      {i > 0 &&
                        classTimes?.[i - 1]?.[day] &&
                        classTimes[i - 1][day].map(
                          (class_) =>
                            dayjs(selectedDate).isBetween(
                              dayjs(class_.start_date),
                              dayjs(class_.end_date).add(6, 'day'),
                              null,
                              '[]',
                            ) && 
                            (
                              <ClassCard
                                class_={{...class_,
                                class_date: dayjs(selectedDate).day(day).format('YYYY-MM-DD')}}
                                shouldOpen={
                                  now.isSame(selectedDate) &&
                                  now.day() === day &&
                                  handleShouldOpen(class_)
                                }
                              />
                            ),
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
  )
}

export default Calendar
