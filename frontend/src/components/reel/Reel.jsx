import React from 'react'
import { Player, ControlBar } from 'video-react';
import 'video-react/dist/video-react.css';
const Reel = () => {
  return (
    <Player style={{ width: "50px" }} autoPlay={true} src="https://media.w3.org/2010/05/sintel/trailer_hd.mp4">

    </Player>
  )
}

export default Reel