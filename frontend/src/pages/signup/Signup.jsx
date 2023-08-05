import React from 'react'
import "./signup.css"
const Signup = () => {
  return (
    <div className='signupContainer'>
      <div className="mainContainerTop">
        <img className='heroImg' src="./images/hero.png" />
        <form className='signupForm'>
          <h2 className='title'>Quickster</h2>
          <input
            type='' className='inputField'
            placeholder='Phone number, username or email address'
          />
          <input className="inputField" type='password' placeholder='Password' />

          <button className='signupButton'>
            login
          </button>
        </form>
        <span>OR</span>
        <div>
          <img src="" />
          <span>Login with Facebook</span>
        </div>
        <span>Forgotten your password</span>
      </div>
      <div className='mainContainerBottom'>
        Don't have account?
        <a>Sign up</a>
      </div>


    </div>
  )
}

export default Signup