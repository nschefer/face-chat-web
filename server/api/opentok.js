const router = require('express').Router()
const {OTSession, User} = require('../db/models')
const OpenTok = require('opentok')
const config = require('../../config.json')
module.exports = router

const opentok = new OpenTok(config.apiKey, config.apiSecret)

//When User clicks start call, create a new session and send back sessionId
router.post('/', (req, res, next) => {
  opentok.createSession(async (err, session) => {
    if (err) {
      console.log('Error Creating OpenTok Session')
      console.error(err)
    } else if (req.user) {
      try {
        console.log('Session Id: ', session.sessionId)
        //create session in db
        await OTSession.create({
          sessionId: session.sessionId,
          userId: req.user.id
        })
        res.sendStatus(201)
      } catch (error) {
        next(error)
      }
    } else {
      console.log('You must be signed in to start a call')
    }
  })
})

//Sends sessionId and token to client for connection to session
router.get('/', async (req, res, next) => {
  let userId = req.user.id
  if (req.body.id) userId = req.body.id

  try {
    const session = await OTSession.findOne({
      where: {
        userId: userId
      }
    })

    console.log('Session Id in the get route:', session.sessionId)

    const token = opentok.generateToken(session.sessionId)

    res.json({
      id: session.sessionId,
      token: token
    })
  } catch (error) {
    next(error)
  }
})
