import React from 'react'

const SigninWithFacebook = () => {
  const facebook = () => {
    window.open("http://localhost:8000/auth/user/signin/facebook", "_self")
  }

  return (
    <div>
      <button onClick={facebook}>signin with facebook</button>
    </div>

  )
}

export default SigninWithFacebook