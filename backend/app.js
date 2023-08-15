const express = require("express");
const db = require("./config/db");
const mainRoute = require("./routes/mainRouter")
const cors = require("cors");
const passport = require("passport");
const passportSetup = require("./middlewares/passport")
db.connect();
const app = express();
app.use(cors());
var session = require('express-session');
app.use(session({ secret: 'SECRET' }));;
app.use(passport.initialize());
app.use(passport.session())

app.use(mainRoute)

app.listen(8000, () => {
    console.log("app is listening to port 8000")
})