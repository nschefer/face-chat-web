const Sequelize = require('sequelize')
const db = require('../db')

const OTSession = db.define('otsession', {
  sessionId: Sequelize.STRING
})

module.exports = OTSession
