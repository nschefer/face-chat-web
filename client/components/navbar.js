import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import PropTypes from 'prop-types'
import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {logout} from '../store'

const Navbar = ({handleClick, isLoggedIn}) => (
  <div>
    <div>
      {isLoggedIn ? (
        <ButtonGroup fullWidth>
          <Button component={Link} to="/home">
            Home
          </Button>
          <Button href="#" onClick={handleClick}>
            Logout
          </Button>
        </ButtonGroup>
      ) : (
        <ButtonGroup fullWidth>
          <Button component={Link} to="/login">
            Login
          </Button>
          <Button component={Link} to="/signup">
            Signup
          </Button>
        </ButtonGroup>
      )}
    </div>
    {/* <hr /> */}
  </div>
)

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    isLoggedIn: !!state.user.id
  }
}

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout())
    }
  }
}

export default connect(mapState, mapDispatch)(Navbar)

/**
 * PROP TYPES
 */
Navbar.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
