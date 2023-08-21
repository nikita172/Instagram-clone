import React from 'react'
import "./post.css"
import Carousel from "../carousel/Carousel"
import ReelVideo from '../reelVideo/ReelVideo'
const Post = (props) => {
  return (
    <div className="post">
      <div className='postTop'>
        <div className='postTopLeft'>
          <img className='postProfileImg' src="/images/nikki.jpg" />
          <div className='postsHolderId'>lamawebdev</div>
          <span className='uploadTime'>
            <div className='dot'></div>
            <div className='online'>15h</div>
          </span>
        </div>
        <img className="postTopRight" src="/images/more-horizontal.svg" />
      </div>
      <div className="postBottom">
        {props.type === "carousel" ? <Carousel /> : <ReelVideo src={props.src} />}
        <div className='postDescription'>
          <div className="subscribe">
            <div className='subsLeft'>
              <img src="/images/heart.svg" />
              <img src="/images/message-circle (1).svg" />
              <img src="/images/send.svg" />
            </div>
            <div className="subsRight">
              <img src="/images/bookmark.svg" />
            </div>
          </div>
          <div className="totalLikes">23 Likes</div>
          <div className="postDesc">lamawebdev <span className='userDesc'>
            {"Daily web development tips and memes. Like & share for more. Please visit our website".substring(0, 50)} ...
          </span>

          </div>
          <span className='seeMoreComments'>more</span>
          <div className="viewAllComments">View All 36 Comments</div>
        </div>
      </div>
    </div>
  )
}

export default Post