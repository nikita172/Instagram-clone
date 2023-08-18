import React from 'react'
import "./posts.css"
import Post from '../post/Post'
import Reel from '../reel/Reel'
const Posts = () => {
  return (
    <div className='postsContainer'>
      <Post />
      <Post />
      <Reel />
    </div>
  )
}

export default Posts