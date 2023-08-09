const router = require("express").Router();
const controller = require("../controllers/auth")

router.post("/signup/email", controller.signupWithEmail)
// router.post("/signup/sendmail", controller.sendEmail)
router.get("/verify/:userId/:uniqueString", controller.verifyEmail)
router.get("/verify/page", controller.verifyPage)


router.post("/register/sendotp", controller.sendOtp)

module.exports = router