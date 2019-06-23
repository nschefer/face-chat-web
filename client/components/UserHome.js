import {Avatar} from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import {makeStyles} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import MissedVideoCall from '@material-ui/icons/MissedVideoCall'
import Videocam from '@material-ui/icons/Videocam'
import PropTypes from 'prop-types'
import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'

const useStyles = makeStyles(theme => ({
  button: {
    margin: 20
  },
  root: {
    flexGrow: 1
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  avatar: {
    marginTop: 20,
    backgroundColor: theme.palette.secondary.main,
    width: 60,
    height: 60
  }
}))

export const UserHome = props => {
  const {email} = props
  const classes = useStyles()

  return (
    <div>
      <Container maxWidth="sm">
        <div className={classes.paper}>
          <Typography component="h1" variant="h1" align="center">
            Welcome to Face-Chat
          </Typography>
          <Typography component="h5" variant="h5" align="center">
            {email}
          </Typography>
          <Avatar className={classes.avatar}>
            <Videocam />
          </Avatar>
          <Button
            variant="contained"
            component={Link}
            to="/startcall"
            className={classes.button}
            color="primary"
            fullWidth
          >
            Start Video Call
          </Button>
          <Avatar className={classes.avatar}>
            <MissedVideoCall />
          </Avatar>
          <Button
            variant="contained"
            component={Link}
            to="/joincall"
            className={classes.button}
            color="primary"
            fullWidth
          >
            Join Video Call
          </Button>
        </div>
      </Container>
    </div>
  )
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    email: state.user.email
  }
}

export default connect(mapState)(UserHome)

/**
 * PROP TYPES
 */
UserHome.propTypes = {
  email: PropTypes.string
}
