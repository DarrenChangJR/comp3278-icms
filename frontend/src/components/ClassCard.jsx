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
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'

const ClassCard = ({ class_, shouldOpen }) => {
  console.log(class_, shouldOpen);
  const { palette } = useTheme()
  const [open, setOpen] = useState(shouldOpen)

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  // do foreach on the notes, and make them clickable links of notes.title that link to notes.notes_link
  const notes = class_.notes.map((noteObj) => {
    return (
      <Button
        key={noteObj.title}
        href={noteObj.notes_link}
        target="_blank"
        rel="noopener noreferrer"
        color="primary"
        endIcon={<OpenInNewIcon />}
      >
        {noteObj.title}
      </Button>
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
          }}
          width="400px"
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
          <Typography variant="h4" gutterBottom>
            {class_.code}
          </Typography>
          <Typography variant="h5" gutterBottom>
            {class_.name}
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
              Join Zoom Meeting
            </Button>
          </Box>
          <Typography variant="body1" color="textPrimary" gutterBottom>
            Teacher's Message: {class_.teacher_message}
          </Typography>
          <Typography variant="h6" gutterBottom>
            Notes
          </Typography>
          {notes}
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
          {class_.name}
        </Typography>
      </Stack>
    </>
  )
}

export default ClassCard
