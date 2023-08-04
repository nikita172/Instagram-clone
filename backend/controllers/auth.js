const User = require("../models/User")
const sms = require("../middlewares/sms")
module.exports.sendOtp = async (req, res) => {
    try {
        const { phoneNumber } = req.body;
        if (!phoneNumber) throw new Error("Phone number cannot be empty!");
        const response = sms.send(phoneNumber);
        res.json({
            status: response
        })

    }
    catch (err) {
        console.log(err)
    }


}



// module.exports.login = async (req, res) => {
//     console.log("sign up with email runs....")
//     try {
//         const { userName, password } = req.body;
//         const setUser = new User({
//             userName: userName,
//             password: password
//         })
//         await setUser.save()
//         res.json({
//             status: 1,
//             success: true
//         })
//     } catch (err) { console.log(err) }

// }