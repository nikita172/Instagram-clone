const router = require("express").Router();
const controller = require("../controllers/auth")

//register
router.post("/signup/email", controller.signupWithEmail)
router.post("/signup/email/resend/verification", controller.resendEmailVerification)
router.get("/verify/:userId/:uniqueString", controller.verifyEmail)
router.post("/signup/mobile", controller.signupWithMobile)
router.post("/verify/mobile", controller.verifyMobile);
router.post("/signup/mobile/resend/otp", controller.resendMobileVerification);
router.get("/verified", controller.verifyPage)


//login
router.post("/signin", controller.signIn)


// router.post("/register/sendotp",controller.sendOtp)

module.exports = router