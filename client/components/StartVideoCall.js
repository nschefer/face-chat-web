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
    sessionId: config.sessionId,
    token: config.token
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
export default class StartVideoCall extends Component {
  constructor(props) {
    super(props)
    this.state = {
      connected: false,
      active: false,
      publishers: null,
      subscribers: null,
      meta: null,
      localAudioEnabled: true,
      localVideoEnabled: true
    }
  }

  componentDidMount = () => {
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
