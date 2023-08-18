import React from 'react'
import "./sidebar.css"
const Sidebar = () => {
  return (
    <div className='sidebarWrapper'>
      <div>


        <h6 className='instaTitleHome'>Instagram</h6>
        <div className='menubars'>

          <div className='menubar'>
            <div className='menuIconContainer'>
              <img src='/images/home.svg' className='menuIcon' />
              {/* <span className='count'>1</span> */}
            </div>
            <div>Home</div>
          </div>

          <div className='menubar'>
            <div className='menuIconContainer'>
              <img src='/images/search.svg' className='menuIcon' />
              {/* <span className='count'>1</span> */}
            </div>
            <div>Search</div>
          </div>

          <div className='menubar'>
            <div className='menuIconContainer'>
              <img src='/images/compass.svg' className='menuIcon' />
              <span className='count'>1</span>
            </div>
            <div>Explore</div>
          </div>

          <div className='menubar'>
            <div className='menuIconContainer'>
              <img src='/images/youtube.svg' className='menuIcon' />
              <span className='count'>1</span>
            </div>
            <div>Reels</div>
          </div>

          <div className='menubar'>
            <div className='menuIconContainer'>
              <img src='/images/message-circle.svg' className='menuIcon' />
              <span className='count'>1</span>
            </div>
            <div>Messages</div>
          </div>

          <div className='menubar'>
            <div className='menuIconContainer'>
              <img src='/images/heart.svg' className='menuIcon' />
              <span className='count'>1</span>
            </div>
            <div>Notification</div>
          </div>

          <div className='menubar'>
            <div className='menuIconContainer'>
              <img src='/images/plus-square.svg' className='menuIcon' />
              {/* <span className='count'>1</span> */}
            </div>
            <div>Create</div>
          </div>

          <div className='menubar'>
            <div className='menuIconContainer'>
              <img src='/images/home.svg' />
            </div>
            <div>Profile</div>
          </div>
        </div>
      </div>
      <div className='more'>
        <img src="/images/menu.svg" className='moreIcon' />
        <div className='moreTitle'>More</div>
      </div>
    </div>
  )
}

export default Sidebar