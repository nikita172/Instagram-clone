import React from "react";
import "./signup.css";
import Bottom from "../../components/bottom/Bottom";
import { useLocation, useNavigate } from "react-router-dom";

const Signup = () => {
  // const location = useLocation();
  // console.log(location)
  const navigate = useNavigate();
  return (
    <div>
      <div className="signupContainer">
        <div className="signupTopContainer">
          <h2 className="title">Instagram</h2>
          <p className="info">
            Sign up to see photos and videos from your friends.{" "}
          </p>
          <button type="submit" className="loginwithfb">
            <img className="fblogo" src="./images/fblogo.png" /> Log in with
            Facebook
          </button>
          <div className="orSection">
            <div className="horizontalBorder"></div>
            <div className="orTitle">OR</div>
            <div className="horizontalBorder"></div>
          </div>
          <form className="signupForm">
            <input
              type=""
              className="inputField"
              placeholder="Mobile number or email address"
            />
            <input className="inputField" type="text" placeholder="Full Name" />
            <input className="inputField" type=" " placeholder="Username" />
            <input
              className="inputField"
              type="password"
              placeholder="Password"
            />
          </form>
          <div className="extrainfo">
            <p>
              People who use our service may have uploaded your contact
              information to Instagram.
              <a
                href="https://www.facebook.com/help/instagram/261704639352628"
                target="_blank"
                rel="noopener noreferrer"
              >
                learn more
              </a>
            </p>
          </div>
          <div className="termsinfo">
            <p>
              By signing up, you agree to our{" "}
              <a href="https://help.instagram.com/581066165581870/?locale=en_GB">
                Terms
              </a>
              ,
              <a href="https://www.facebook.com/privacy/policy">
                {" "}
                Privacy Policy{" "}
              </a>
              and{"  "}
              <a href="https://help.instagram.com/1896641480634370/">
                Cookies Policy
              </a>
              .
            </p>
          </div>
          <button type="submit" className="signupbtn">
            {" "}
            Sign Up
          </button>
        </div>
      </div>
      <div className="mainContainerBottom">
        <div className="mc1">
          Have an account ?<div className="signupBtn" onClick={() => navigate("/signin")}> Log in</div>
        </div>
        <div className="mc2">
          <div className="downloadSection">Get the app.</div>
          <div className="sourceImg">
            <img className="gpImg" src="./images/googleplay.png" />
            <img className="gpImg2" src="./images/getFromMs.png" />
          </div>
        </div>
        <Bottom />
      </div>
    </div>
  );
};

export default Signup;
