const router = require("express").Router();
const controller = require("../controllers/auth")

//register
router.post("/signup/email", controller.signupWithEmail)

router.post("/signup/email/resend", controller.resendEmailVerification)
// router.post("/signup/sendmail", controller.sendEmail)
router.get("/verify/:userId/:uniqueString", controller.verifyEmail)
router.get("/verified", controller.verifyPage)

//login
router.post("/signin", controller.signIn)


// router.post("/register/sendotp",controller.sendOtp)

module.exports = router