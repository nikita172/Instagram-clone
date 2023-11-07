import React from 'react'
import Sidebar from '../../components/sidebar/Sidebar'
import "./profile.css"
import hexagon from "../../icons/hexagon.svg";
import defaultProfile from "../../icons/DefaultProfilePic.jpg";
import profileImg from "../../icons/nikki.jpg";
import Stories from '../../components/stories/Stories';
import Post from '../../components/post/Post';
import Posts from '../../components/posts/Posts';
import UserProfilePosts from '../../components/userProfilePosts/UserProfilePosts';
import HomeBottom from '../../components/homeBottom/HomeBottom';

import Bottom from '../../components/bottom/Bottom';
const Profile = () => {
  return (
    <div className='profileContainer'>
      <div className="sidebarContainer">
        <Sidebar />
      </div>
      <div className="profileMainView">
        <div className="mainSection">
          <div className="profileSection">
            <img className="profilePic" src={defaultProfile} />
            <div className="bioNameSec">
              <div className="profileUserName">
                <span className='profileName'>nikita.rawat14</span>
                <span className='editButton'>Edit profile</span>
                <span className='archiveButton'>View archive</span>
                <span><img src={hexagon} /></span>
              </div>
              <div className="followingPart">
                <span>0 posts</span>
                <span>0 followers</span>
                <span>0 following</span>
              </div>
              <div className="displayName">
                nikki
              </div>
            </div>

          </div>


          <div className="profileHighlightsSec">
            <div className="highlightSec">
              <img className='profileImg' src={profileImg} />
              <span>❣</span>
            </div>
            <div className="highlightSec">
              <img className='profileImg' src={profileImg} />
              <span>❣</span>
            </div>
            <div className="highlightSec">
              <img className='profileImg' src={profileImg} />
              <span>❣</span>
            </div>
            <div className="highlightSec">
              <img className='profileImg' src={profileImg} />
              <span>❣</span>
            </div>
            <div className="highlightSec">
              <img className='profileImg' src={profileImg} />
              <span>❣</span>
            </div>
            <div className="highlightSec">
              <img className='profileImg' src={profileImg} />
              <span>❣</span>
            </div>
            <div className="highlightSec">
              <img className='profileImg' src={profileImg} />
              <span>❣</span>
            </div>
            <div className="highlightSec">
              <img className='profileImg' src={profileImg} />
              <span>❣</span>
            </div>
            <div className="highlightSec">
              <img className='profileImg' src={profileImg} />
              <span>❣</span>
            </div>
            <div className="highlightSec">
              <img className='profileImg' src={profileImg} />
              <span>❣</span>
            </div>
            <div className="highlightSec">
              <img className='profileImg' src={profileImg} />
              <span>❣</span>
            </div>
            <div className="highlightSec">
              <img className='profileImg' src={profileImg} />
              <span>❣</span>
            </div>
            <div className="highlightSec">
              <img className='profileImg' src={profileImg} />
              <span>❣</span>
            </div>
            <div className="highlightSec">
              <img className='profileImg' src={profileImg} />
              <span>❣</span>
            </div>
          </div>

          <div className="selfPosts">
            <div className="selectedTitles">
              <span>POSTS</span>
              <span>SAVED</span>
              <span>TAGGED</span>
            </div>
            <div className="userPostsAndReels">
              <UserProfilePosts />
              <UserProfilePosts /><UserProfilePosts /><UserProfilePosts />
            </div>
          </div>

          <Bottom />



        </div>
      </div>
    </div>
  )
}

export default Profile