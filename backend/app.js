const express = require("express");
const db = require("./config/db");
const mainRoute = require("./routes/mainRouter")
const cors = require("cors");
db.connect();
const app = express();
app.use(cors());

app.use(mainRoute)

app.listen(8000, () => {
    console.log("app is listening to port 8000")
})