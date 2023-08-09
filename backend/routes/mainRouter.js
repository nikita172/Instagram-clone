
const auth = require("./auth")
const router = require("express").Router();
const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get('/', (req, res) => {
    res.send("Welcome to Instagram clone")
})

router.use("/auth/user", auth)

module.exports = router