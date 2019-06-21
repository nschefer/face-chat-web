const users = {}

//socket.io for raw webRTC
module.exports = io => {
  io.on('connection', socket => {
    console.log(`A socket connection to the server has been made: ${socket.id}`)

    socket.on('login', username => {
      console.log('User logged', username)
      if (users[username]) {
        socket.emit('login', false)
      } else {
        users[username] = socket.id
        socket.username = username
        socket.emit('login', true)
      }
    })

    socket.on('offer', (offer, otherUsername) => {
      console.log('Sending offer to: ', otherUsername)
      if (users[otherUsername] !== null) {
        socket.otherUsername = otherUsername
        io.to(users[otherUsername]).emit('offer', offer, socket.username)
      }
    })

    socket.on('answer', (answer, otherUsername) => {
      console.log('Sending answer to: ', otherUsername)
      if (users[otherUsername] !== null) {
        socket.otherUsername = otherUsername
        io.to(users[otherUsername]).emit('answer', answer)
      }
    })

    socket.on('candidate', candidate => {
      console.log('Sending candidate to: ', socket.otherUsername)
      if (users[socket.otherUsername] !== null) {
        io.to(users[socket.otherUsername]).emit('candidate', candidate)
      }
    })

    socket.on('close', () => {
      console.log('Disconnecting from', socket.otherUsername)
      if (users[socket.otherUsername] !== null) {
        io.to(users[socket.otherUsername]).emit('close')
      }
    })

    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`)
    })
  })
}
