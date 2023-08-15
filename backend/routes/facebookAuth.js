const router = require("express").Router();
const passport = require("passport")
const CLIENT_URL = "http://localhost:3000/";
router.get('/facebook',
  passport.authenticate('facebook', { scope: ["profile"] }));

router.get('/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: CLIENT_URL,
    failureRedirect: "/auth/signin/facebook/failed",
  })
);

router.get("/signin/facebook/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "failure",
  });
})
router.get("/signin/facebook/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "successful",
      user: req.user,
      //   cookies: req.cookies
    });
  }
})
module.exports = router