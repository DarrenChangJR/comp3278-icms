import { useState } from 'react'
import {
  Box,
  IconButton,
  Modal,
  Paper,
  Stack,
  Typography,
  useTheme,
  Button,
  Grid,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'

const ClassCard = ({ class_, shouldOpen }) => {
  const { palette } = useTheme()
  const [open, setOpen] = useState(shouldOpen)

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const sendEmail = () => {
    const token = localStorage.getItem('access_token')
    fetch('http://localhost:8000/email-info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        class_id: class_.class_id,
        course_id: class_.course_id,
        class_date: class_.class_date,
      }),
    })
      .then((res) => {
        return res.json()
      })
      .then((data) => {
        console.log(data)
      })
  }

  const notes = class_.notes.map((noteObj) => {
    return (
      <Box mb={1} key={noteObj.note_id}>
        <Button
          key={noteObj.note_id}
          href={noteObj.note_link}
          target="_blank"
          rel="noopener noreferrer"
          color="primary"
          endIcon={<OpenInNewIcon />}
        >
          {noteObj.title}
        </Button>
      </Box>
    )
  })

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          sx={{
            transform: 'translate(-50%, -50%)',
            overflowY: 'auto',
            maxHeight: '90vh',
          }}
          width="40%"
          component={Paper}
          p={2}
          border={2}
          borderColor="divider"
        >
          <Stack
            direction="row"
            justifyContent="end"
            alignItems="center"
            spacing={2}
          >
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Stack>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h4" mb={-4}>
              {class_.code}
            </Typography>
            <Button
              href={class_.moodle_link}
              target="_blank"
              rel="noopener noreferrer"
              color="primary"
              startIcon={<OpenInNewIcon />}
            >
              Moodle
            </Button>
          </Box>
          <Typography variant="h5" gutterBottom>
            {class_.course_name}
          </Typography>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="subtitle1" color="textSecondary">
              {class_.location} ({class_.type}) {class_.start_time} -{' '}
              {class_.end_time}
            </Typography>
            <Button
              href={class_.zoom_link}
              target="_blank"
              rel="noopener noreferrer"
              color="primary"
              startIcon={<OpenInNewIcon />}
            >
              Zoom
            </Button>
          </Box>
          {/* display main staff's information such as name, email, office_location, and office_hours */}
          <Grid container>
            <Grid item xs={6}>
              <Box mb={-1}>
                <Typography variant="h6">
                  {class_.staffs[0].staff_name}
                </Typography>
              </Box>
              <Box mb={-1}>
                <Box component="span" sx={{ textIndent: '2em' }}>
                  <Typography variant="subtitle1" color="textSecondary">
                    {class_.staffs[0].staff_email}
                  </Typography>
                </Box>
              </Box>
              <Box component="span" sx={{ textIndent: '2em' }}>
                <Typography variant="subtitle1" color="textSecondary">
                  {class_.staffs[0].office_hours} (
                  {class_.staffs[0].office_location})
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box mb={-1}>
                <Typography variant="h6">Teacher's Message:</Typography>
              </Box>
              <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                <em>"{class_.teacher_message}"</em>
              </Typography>
            </Grid>
          </Grid>
          <Typography variant="h6" gutterBottom>
            Notes
          </Typography>
          {notes}
          <Box display="flex" justifyContent="flex-end">
            <Button color="primary" onClick={sendEmail} variant="outlined">
              Send to Email
            </Button>
          </Box>
        </Box>
      </Modal>
      <Stack
        position="absolute"
        top={0}
        zIndex={1}
        width="90%"
        height={`calc(56px * ${class_.slot_length || 1})`}
        bgcolor={palette.primary.light}
        borderRadius={1}
        boxShadow={1}
        p={1}
        boxSizing={'border-box'}
        sx={{
          ':hover': {
            cursor: 'pointer',
            backgroundColor: palette.primary.main,
          },
        }}
        onClick={handleOpen}
      >
        <Typography variant="body2" color="white">
          {class_.code}
        </Typography>
        <Typography variant="caption" color="white">
          {class_.course_name}
        </Typography>
      </Stack>
    </>
  )
}

export default ClassCard
