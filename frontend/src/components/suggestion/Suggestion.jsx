import React from 'react'
import "./suggestion.css"
import SuggestedUser from '../suggestedUser/SuggestedUser'
import HomeBottom from "../homeBottom/HomeBottom"
const Suggestion = () => {
  return (
    <div className='suggestionWrapper'>
      <div className="suggestionTop">
        <div className='suggestionLeft'>
          <img className="suggestionUserProfile" src="/images/nikki.jpg" />
          <div className='suggestionUserName'>
            <div className='suggestionFullName'>nikita.rawat14</div>
            <div className='suggestionUniqueName'>nikki 2.0</div>
          </div>
        </div>
        <div className="suggestionRight">
          Switch
        </div>
      </div>
      <div className="suggestionBottom">
        <div className='suggestionTag'>
          <p className='forYou'>Suggested for you</p>
          <p className='seeAll'>See All</p>
        </div>

        <div className="suggestionUsers">
          <SuggestedUser />
          <SuggestedUser />
          <SuggestedUser />
          <SuggestedUser />


        </div>
        <HomeBottom />

      </div>
    </div>
  )
}

export default Suggestion