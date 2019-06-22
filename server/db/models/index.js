const User = require('./user')
const OTSession = require('./oTsession')

OTSession.belongsTo(User)

module.exports = {
  User,
  OTSession
}
