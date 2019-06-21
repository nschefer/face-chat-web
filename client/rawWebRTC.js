//raw webRTC with socket.io
import io from 'socket.io-client'

export const socket = io(window.location.origin)

let connection

socket.on('connect', () => {
  console.log('Connected to the signaling server')
})

document.querySelector('button#login').addEventListener('click', event => {
  const username = document.querySelector('input#username').value

  if (username.length < 0) {
    alert('Please enter a username 🙂')
    return
  }

  socket.emit('login', username)
})

socket.on('login', async success => {
  if (!success) {
    alert('Username already taken')
  } else {
    document.getElementById('login').style.display = 'none'
    document.getElementById('call').style.display = 'block'

    let localStream
    try {
      localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })
    } catch (error) {
      alert(`${error.name}`)
      console.error(error)
    }

    document.getElementById('local').srcObject = localStream

    const configuration = {
      iceServers: [{url: 'stun:stun2.1.google.com:19302'}]
    }

    connection = new RTCPeerConnection(configuration)

    connection.addStream(localStream)

    connection.onaddstream = event => {
      document.getElementById('remote').srcObject = event.stream
    }

    connection.onicecandidate = event => {
      if (event.candidate) {
        socket.emit('candidate', event.candidate)
      }
    }
  }
})

let otherUsername

document.querySelector('button#call').addEventListener('click', () => {
  const callToUsername = document.getElementById('username-to-call').value

  if (callToUsername.length === 0) {
    alert('Enter a username')
    return
  }

  otherUsername = callToUsername

  connection.createOffer(
    offer => {
      socket.emit('offer', offer, otherUsername)

      connection.setLocalDescription(offer)
    },
    error => {
      alert('Error when creating an offer')
      console.error(error)
    }
  )
})

socket.on('offer', (offer, username) => {
  otherUsername = username
  connection.setRemoteDescription(new RTCSessionDescription(offer))
  connection.createAnswer(
    answer => {
      connection.setLocalDescription(answer)
      socket.emit('answer', answer, otherUsername)
    },
    error => {
      alert('Error when creating an answer')
      console.error(error)
    }
  )
})

socket.on('answer', answer => {
  connection.setRemoteDescription(new RTCSessionDescription(answer))
})

socket.on('candidate', candidate => {
  connection.addIceCandidate(new RTCIceCandidate(candidate))
})

document.getElementById('close-call').addEventListener('click', () => {
  socket.emit('close')

  otherUsername = null
  document.getElementById('remote').src = null
  connection.close()
  connection.onicecandidate = null
  connection.onaddstream = null
})

socket.on('close', () => {
  otherUsername = null
  document.getElementById('remote').src = null
  connection.close()
  connection.onicecandidate = null
  connection.onaddstream = null
})
