import React from 'react'
import "./signin.css"
import Bottom from '../../components/bottom/Bottom'
const Signin = () => {
  return (
    <div>
      <div className='signinContainer'>
        <div className="signinWrapper">
          <img className='heroImg' src="./images/insta.jpg" />
          <div className="mainContainer">
            <div className="mainContainerTop">
              <form className='signinForm'>
                <h2 className='title'>Instagram</h2>
                <input
                  type='' className='inputField'
                  placeholder='Phone number, username or email address'
                />
                <input className="inputField" type='password' placeholder='Password' />
                <button className='signinButton'>
                  Log in
                </button>
              </form>
              <div className='orSection'>
                <div className='horizontalBorder'></div>
                <div className='orTitle'>OR</div>
                <div className='horizontalBorder'></div>
              </div>
              <div className='loginChoiceContainer'>
                <img src="./images/fbLogo.avif" className='fbImg' />
                <span className='loginWithFbTitle'>Log in with Facebook</span>
              </div>
              <div className='forgetPassword'>Forgotten your password?</div>
            </div>
            <div className='mainContainerBottom'>
              <div className='mc1'>
                Don't have an account?
                <div className='signupBtn'>Sign up</div>
              </div>
              <div className='mc2'>
                <div className='downloadSection'>
                  Get the App.
                </div>
                <div className='sourceImg'>
                  <img className='gpImg' src="./images/googleplay.png" />
                  <img className='gpImg2' src="./images/getFromMs.png" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Bottom />
    </div>
  )
}

export default Signin