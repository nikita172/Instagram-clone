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
router.post("/email/password-reset/request", controller.resetPasswordEmailRequest)
router.post("/email/password-reset/verification", controller.resetPasswordEmailVerification)
router.post("/mobile/password-reset/otp/request", controller.resetPasswordMobileOtpRequest)
router.post("/mobile/password-reset/otp/verification", controller.resetPasswordMobileOtpVerification)



//login
router.post("/signin", controller.signIn)


// router.post("/register/sendotp",controller.sendOtp)

module.exports = router