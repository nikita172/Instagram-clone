import React, { useState } from 'react'
import "./posts.css"
import Post from '../post/Post'

const Posts = () => {
  return (
    <div className='postsContainer'>
      <Post type="carousel" />
      <Post type="carousel" />
      <Post type="carousel" />
      <Post type="reel" src="https://samplelib.com/lib/preview/mp4/sample-5s.mp4" />
      <Post type="reel" src="https://samplelib.com/lib/preview/mp4/sample-5s.mp4" />
      <Post type="reel" src="https://media.w3.org/2010/05/sintel/trailer_hd.mp4" />
      <Post type="reel" src="https://samplelib.com/lib/preview/mp4/sample-5s.mp4" />
    </div>
  )
}

export default Posts