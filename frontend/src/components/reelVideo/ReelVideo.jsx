import React, { useRef, useState, useEffect } from 'react';
import "./reelVideo.css"

import mute from "../../icons/mute.svg";
import unmute from "../../icons/unmute.svg";
import play from "../../icons/play.svg"


const ReelVideo = ({ src }) => {
  const videoRef = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // Default to muted
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5, // Adjust threshold as needed
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      options
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isInView && videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    } else if (!isInView && videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isInView]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="reel-video" >
      <div className='toggleContainer'>
        <button className='toggleBtnMute' onClick={toggleMute} >
          {isMuted ? <img src={unmute} /> : <img src={mute} />}
        </button>
        <button className='toggleBtnPlay'>
          {isPlaying ? '' : <img src={play} className='playBtn' />}
        </button>
      </div>
      <video ref={videoRef} src={src} loop width="370px"
        height="600px" className='video' onClick={togglePlayPause} />

    </div>
  );
};

export default ReelVideo;
