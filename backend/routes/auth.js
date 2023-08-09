const router = require("express").Router();
const controller = require("../controllers/auth")

router.post("/register", controller.register)
router.post("/register/sendotp", controller.sendOtp)

module.exports = router