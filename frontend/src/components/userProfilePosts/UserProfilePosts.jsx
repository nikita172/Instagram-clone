import React from 'react'
import "./userProfilePosts.css"
import nikki from "../../icons/nikki.jpg"
const UserProfilePosts = () => {
  return (
    <div className='userProfilePosts'>
      <img className='userProfilePost' src={nikki} />
    </div>
  )
}

export default UserProfilePosts