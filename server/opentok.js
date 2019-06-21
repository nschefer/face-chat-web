const OpenTok = require('opentok')
const config = require('../config.json')
const opentok = new OpenTok(config.apiKey, config.apiSecret)

opentok.createSession((err, session) => {
  if (err) return console.log(err)
})
