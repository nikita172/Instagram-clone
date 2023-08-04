const mongoose = require('mongoose');
require("dotenv/config")
module.exports.connect = function () {
    try {
        mongoose.connect(process.env.CONNECTION_STRING,
            () => {
                console.log("connection with the database is successfull! ")
            })

    } catch (err) {
        console.log(err)
    }
}