const router = require("express").Router();
const controller = require("../controllers/auth")
const passport = require("passport")
require("../middlewares/passport.js")


//register
router.post("/signup/email", controller.signupWithEmail)
router.post("/signup/email/resend/verification", controller.resendEmailVerification)
router.get("/verify/:userId/:uniqueString", controller.verifyEmail)
router.post("/signup/mobile", controller.signupWithMobile)
router.post("/verify/mobile", controller.verifyMobile);
router.post("/signup/mobile/resend/otp", controller.resendMobileVerification);
router.get("/verified", controller.verifyPage)
router.post("/email/password-reset/request", controller.resetPasswordEmailRequest)
router.post("/email/password-reset/verification", controller.resetPasswordEmailVerification)
router.post("/mobile/password-reset/otp/request", controller.resetPasswordMobileOtpRequest)
router.post("/mobile/password-reset/otp/verification", controller.resetPasswordMobileOtpVerification)


//facebook signin authentication
router.get("/signin/facebook/failed", controller.signinFailedFacebook);
router.get("/signin/facebook/success", controller.signinFacebookSuccess)

const CLIENT_URL = "http://localhost:3000/";

router.get('/signin/facebook',
  passport.authenticate('facebook', { scope: ["profile"] }));

router.get('/signin/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: CLIENT_URL,
    failureRedirect: "/auth/user/signin/facebook/failed",
  })
);


//login
router.post("/signin", controller.signIn)


// router.post("/register/sendotp",controller.sendOtp)

module.exports = router