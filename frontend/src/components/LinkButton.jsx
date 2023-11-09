import { Button } from '@mui/material'
import { Link } from 'react-router-dom'

const LinkButton = ({ children, LinkProps, ButtonProps }) => (
  <Button
    component={Link}
    {...LinkProps}
    sx={{
      justifyContent: 'start',
      px: 2,
      py: 1,
    }}
    {...ButtonProps}
  >
    {children}
  </Button>
)

export default LinkButton
