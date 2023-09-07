import React from 'react'
import "./suggestedUser.css"
const SuggestedUser = () => {
  return (
    <div className="suggestionUser">
      <div className='suggestionUserLeft'>
        <img className="suggestionUserProfile" src="/images/nikki.jpg" />
        <div className='suggestionUserName'>
          <div className='suggestionFullName'>nikita.rawat14</div>
          <div className='followedBy'>Followed by nikitarwt...</div>
        </div>
      </div>
      <div className="suggestionUserRight">
        Follow
      </div>
    </div>
  )
}

export default SuggestedUser