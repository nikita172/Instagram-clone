import React, { useEffect } from 'react'
import axios from "axios";

import "./home.css"
import Sidebar from '../../components/sidebar/Sidebar';
import Stories from '../../components/stories/Stories';
import Posts from '../../components/posts/Posts';
import Suggestion from '../../components/suggestion/Suggestion';
const Home = () => {
  // useEffect(() => {
  //   const getData = async () => {
  //     const data = await axios.get("http://localhost:8000/auth/user/signin/facebook/success")
  //     console.log(data)
  //   }
  //   getData();

  // }, [])

  return (
    <div className='homeContainer'>
      <div className="sidebarContainer">
        <Sidebar />

      </div>
      <div className='feedContainer'>
        <div className="allStories">
          <Stories />

        </div>
        <Posts />
      </div>
      <div className="suggestionContainer">
        <Suggestion />

      </div>

    </div>
  )
}

export default Home