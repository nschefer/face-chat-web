import axios from 'axios'
import classNames from 'classnames'
import AccCore from 'opentok-accelerator-core'
import 'opentok-solutions-css'
import React, {Component} from 'react'
import config from '../../config.json'

//options and where to render media
let otCore
const otCoreOptions = {
  credentials: {
    apiKey: config.apiKey,
    sessionId: '',
    token: ''
  },
  //which jsx(html) elements will hold your video
  streamContainers(pubSub, type, data, stream) {
    return {
      publisher: {
        camera: '#publisherContainer'
      },
      subscriber: {
        camera: '#subscriberContainer'
      }
    }[pubSub][type]
  },
  controlsContainer: '#controls'
}

//Creates classNames based on state for css
const containerClasses = state => {
  const {active, meta, localAudioEnabled, localVideoEnabled} = state
  const activeCameraSubscribers = meta ? meta.subscriber.camera : 0
  const activeCameraSubscribersGt2 = activeCameraSubscribers > 2
  const activeCameraSubscribersOdd = activeCameraSubscribers % 2
  return {
    //create dynamic classnames to interact with video controls and changes in video
    //classnames api allow control over classname depending on state
    controlClass: classNames('App-control-container', {hidden: !active}),
    localAudioClass: classNames('ots-video-control circle audio', {
      hidden: !active,
      muted: !localAudioEnabled
    }),
    localVideoClass: classNames('ots-video-control circle video', {
      hidden: !active,
      muted: !localVideoEnabled
    }),
    localCallClass: classNames('ots-video-control circle end-call', {
      hidden: !active
    }),
    cameraPublisherClass: classNames('video-container', {
      hidden: !active,
      small: !!activeCameraSubscribers
    }),
    cameraSubscriberClass: classNames(
      'video-container',
      {hidden: !active || !activeCameraSubscribers},
      {'active-gt2': activeCameraSubscribersGt2},
      {'active-odd': activeCameraSubscribersOdd}
    )
  }
}

const enterUser = (onChange, submit, value) => (
  <div className="App-mask">
    <label htmlFor="userToCall">Enter User To Call</label>
    <input type="text" name="userToCall" value={value} onChange={onChange} />
    <button type="submit" className="message button clickable" onClick={submit}>
      Submit
    </button>
  </div>
)

const connecting = () => (
  <div className="App-mask">
    <div className="message with-spinner">Connecting</div>
  </div>
)

const startCallPrompt = start => (
  <div className="App-mask">
    <button type="button" className="message button clickable" onClick={start}>
      Click to Start Call
    </button>
  </div>
)
export default class JoinVideoCall extends Component {
  constructor(props) {
    super(props)
    this.state = {
      connected: false,
      active: false,
      publishers: null,
      subscribers: null,
      meta: null,
      localAudioEnabled: true,
      localVideoEnabled: true,
      userToCall: ''
    }
  }

  componentDidMount() {}

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  submitUser = async event => {
    event.preventDefault()

    const email = this.state.userToCall
    console.log('Email: ', email)

    const {data} = await axios.get(`/api/ot/id/${email}`)

    const userId = data.id
    console.log('UserId: ', userId)

    const credentials = await axios.get(`/api/ot/token/${userId}`)

    const {id, token} = credentials.data
    otCoreOptions.credentials.sessionId = id
    otCoreOptions.credentials.token = token

    otCore = new AccCore(otCoreOptions)
    otCore.connect().then(() => this.setState({connected: true}))
    const events = ['subscribeToCamera', 'unsubscribeFromCamera']

    events.forEach(event =>
      otCore.on(event, ({publishers, subscribers, meta}) => {
        this.setState({publishers, subscribers, meta})
      })
    )
  }

  startCall = () => {
    otCore
      .startCall()
      .then(({publishers, subscribers, meta}) => {
        this.setState({publishers, subscribers, meta, active: true})
      })
      .catch(error => console.log('Start call experienced an error', error))
  }

  endCall = () => {
    otCore.endCall()
    this.setState({active: false})
  }

  toggleLocalAudio = () => {
    otCore.toggleLocalAudio(!this.state.localAudioEnabled)
    this.setState({localAudioEnabled: !this.state.localAudioEnabled})
  }

  toggleLocalVideo = () => {
    otCore.toggleLocalVideo(!this.state.localVideoEnabled)
    this.setState({localVideoEnabled: !this.state.localVideoEnabled})
  }

  render = () => {
    const {connected, active} = this.state
    const {
      localAudioClass,
      localVideoClass,
      localCallClass,
      controlClass,
      cameraPublisherClass,
      cameraSubscriberClass
    } = containerClasses(this.state)

    return (
      <div className="App">
        <h1>This is where you will make your video call</h1>
        <div className="App-main">
          <div className="App-video-container">
            {!connected &&
              enterUser(
                this.handleChange,
                this.submitUser,
                this.state.userToCall
              )}
            {!connected && connecting()}
            {connected && !active && startCallPrompt(this.startCall)}
            <div id="publisherContainer" className={cameraPublisherClass} />
            <div id="subscriberContainer" className={cameraSubscriberClass} />
          </div>
          <div id="controls" className={controlClass}>
            <div className={localAudioClass} onClick={this.toggleLocalAudio} />
            <div className={localVideoClass} onClick={this.toggleLocalVideo} />
            <div className={localCallClass} onClick={this.endCall} />
          </div>
        </div>
      </div>
    )
  }
}
