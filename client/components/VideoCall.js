import React, {Component} from 'react'

export default class VideoCall extends Component {
  async componentDidMount() {
    // try {
    //   const stream = await navigator.mediaDevices.getUserMedia({
    //     audio: false,
    //     video: true
    //   })
    //   const videoTracks = stream.getVideoTracks();
    //   const track = videoTracks[0];
    // } catch (error) {
    // }
  }

  render() {
    return (
      <h1>This is where you will make your video call</h1>
      // <video autoplay>
      //   <source src={stream} />
      // </video>
    )
  }
}
