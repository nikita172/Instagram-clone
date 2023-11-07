import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import instaIcon from "../../icons/insta-icon.png";
import "./sidebar.css";
import Search from '../search/Search';
const Sidebar = () => {
  const navigate = useNavigate();
  const sideNavRef = useRef(null);
  // console.log(sideNavRef)
  const [showSearch, setShowSearch] = useState(false);

  // useEffect(() => {
  //   // console.log("runs")
  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   };
  // }, []);

  // function handleClickOutside(event) {
  //   // console.log(event.target)
  //   if (sideNavRef?.current && !sideNavRef?.current?.contains(event.target)) {
  //     setShowSearch(!showSearch)
  //   }
  // }
  return (
    <div className='sidebarWrapper' ref={sideNavRef}>
      {showSearch && <Search />}
      <div className='sidebarDiv'>
        <h6 className='instaTitleHome'>{showSearch ? <img className='instaLogoImg' src={instaIcon} /> : "Instagram"}</h6>
        <div className='menubars'>

          <div className='menubar' onClick={() => navigate("/")}>
            <div className='menuIconContainer'>
              <img src='/images/home.svg' className='menuIcon' />
              {/* <span className='count'>1</span> */}
            </div>
            {!showSearch && <div className='homeText'>Home</div>}
          </div>

          <div className='menubar' onClick={() => setShowSearch(!showSearch)}>
            <div className='menuIconContainer' >
              <img src='/images/search.svg' className='menuIcon' />
              {/* <span className='count'>1</span> */}
            </div>
            {!showSearch && <div className='homeText'>Search</div>}
          </div>

          <div className='menubar'>
            <div className='menuIconContainer'>
              <img src='/images/compass.svg' className='menuIcon' />
              <span className='count'>1</span>
            </div>
            {!showSearch && <div className='homeText'>Explore</div>}
          </div>

          <div className='menubar'>
            <div className='menuIconContainer'>
              <img src='/images/youtube.svg' className='menuIcon' />
              <span className='count'>1</span>
            </div>
            {!showSearch && <div className='homeText'>Reels</div>}
          </div>

          <div className='menubar'>
            <div className='menuIconContainer'>
              <img src='/images/message-circle.svg' className='menuIcon' />
              <span className='count'>1</span>
            </div>
            {!showSearch && <div className='homeText'>Messages</div>}
          </div>

          <div className='menubar'>
            <div className='menuIconContainer'>
              <img src='/images/heart.svg' className='menuIcon' />
              <span className='count'>1</span>
            </div>
            {!showSearch && <div className='homeText'>Notification</div>}
          </div>

          <div className='menubar'>
            <div className='menuIconContainer'>
              <img src='/images/plus-square.svg' className='menuIcon' />
              {/* <span className='count'>1</span> */}
            </div>
            {!showSearch && <div className='homeText'>Create</div>}
          </div>

          <div className='menubar' onClick={() => navigate("/profile/nikita")}>
            <div className='menuIconContainer'>
              <img src='/images/home.svg' />
            </div>
            {!showSearch && <div className='homeText' >Profile</div>}
          </div>
        </div>
      </div>
      <div className='more'>
        <img src="/images/menu.svg" className='moreIcon' />
        {!showSearch && <div className='moreTitle'>More</div>}
      </div>
    </div>
  )
}

export default Sidebar