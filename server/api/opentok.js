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
        //create session in db
        await OTSession.create({
          sessionId: session.sessionId,
          userId: req.body.id
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

//Sends token to call creator
router.get('/', async (req, res, next) => {
  try {
    const session = await OTSession.findOne({
      where: {
        userId: req.user.id
      }
    })

    const token = opentok.generateToken(session.sessionId)

    res.json({
      id: session.sessionId,
      token: token
    })
  } catch (error) {
    next(error)
  }
})

router.get('/id/:email', async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.params.email
      },
      attributes: ['id']
    })
    res.json(user)
  } catch (error) {
    console.error(error)
    next(error)
  }
})

router.get('/token/:id', async (req, res, next) => {
  try {
    console.log('Req.params: ', req.params)

    const session = await OTSession.findOne({
      where: {
        userId: req.params.id
      }
    })

    const token = opentok.generateToken(session.sessionId)

    res.json({
      id: session.sessionId,
      token: token
    })
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    await OTSession.destroy({
      where: {
        sessionId: req.params.id
      }
    })
    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
})
