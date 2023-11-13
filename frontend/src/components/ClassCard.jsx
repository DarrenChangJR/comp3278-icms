import { useState } from 'react'
import {
  Box,
  IconButton,
  Modal,
  Paper,
  Stack,
  Typography,
  useTheme,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

const ClassCard = ({ class_ }) => {
  const { palette } = useTheme()
  const [open, setOpen] = useState(false)

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

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
          <Typography variant="h6">
            {class_.course_code} - {class_.course_name}
          </Typography>
          <Typography variant="subtitle1">
            {class_.class_type} {class_.start_time} - {class_.end_time}
          </Typography>
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
          {class_.course_code}
        </Typography>
        <Typography variant="caption" color="white">
          {class_.course_name}
        </Typography>
      </Stack>
    </>
  )
}

export default ClassCard
