
const mainRoute = require("./routes/mainRouter")

const express = require("express");
const db = require("./config/db");
db.connect();
const cors = require("cors");
const app = express();
app.use(cors());
app.get("/", (req, res) => {
    res.send("hello")
})
app.use(mainRoute)
app.listen(8000, () => {
    console.log("app is listening to port 8000")
})