import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import PropTypes from 'prop-types'
import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'

const useStyles = {
  button: {
    margin: 20
  },
  root: {
    flexGrow: 1
  }
}

export const UserHome = props => {
  const {email} = props
  const classes = useStyles

  return (
    <div className={classes.root}>
      <Container maxWidth="xs">
        <h1>Welcome to Face-Chat</h1>
        <h3>Welcome, {email}</h3>
        <Button
          variant="contained"
          component={Link}
          to="/startcall"
          className={classes.button}
          color="primary"
        >
          Start Video Call
        </Button>
        <Button
          variant="contained"
          component={Link}
          to="/joincall"
          className={classes.button}
          color="primary"
        >
          Join Video Call
        </Button>
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
