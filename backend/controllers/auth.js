const User = require("../models/User")
const UserVerification = require("../models/UserVerification")

const sms = require("../middlewares/sms")
const bcrypt = require("bcrypt")
const { v4: uuidv4 } = require("uuid")
require("dotenv").config();
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    host: "mail.nikitarawat.site",
    port: 465,
    secure: true,
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS
    }
})

transporter.verify((error, success) => {
    if (error) {
        console.log(error)
    } else {
        console.log("Ready for messages");
        console.log(success);
    }
})


// module.exports.sendOtp = async (req, res) => {
//     try {
//         const { phoneNumber } = req.body;
//         if (!phoneNumber) throw new Error("Phone number cannot be empty!");
//         const response = sms.send(phoneNumber);
//         res.json({
//             status: response
//         })
//     }
//     catch (err) {
//         console.log(err)
//     }
// }

//signup
module.exports.signupWithEmail = async (req, res) => {
    const { email, password, fullName, userName } = req.body;
    User.find({ email })
        .then((result) => {
            if (result.length) {
                res.json({
                    status: "FAILED",
                    message: "User already exist"
                })
            } else {
                User.find({ userName })
                    .then((result) => {
                        if (result.length) {
                            res.json({
                                status: "FAILED",
                                message: "UserName already exist! choose different name."
                            })
                        } else {
                            bcrypt.hash(password, 10)
                                .then((hashedPassword) => {
                                    const newUser = new User({
                                        userName,
                                        fullName,
                                        email,
                                        password: hashedPassword
                                    })
                                    newUser.save().then(result => {
                                        sendVerificationEmail(result, res)
                                    }).catch(err => {
                                        res.json({
                                            status: "FAILED",
                                            message: "An error occurred while saving user account!"
                                        })
                                    })
                                }).catch(err => {
                                    res.json({
                                        status: "FAILED",
                                        message: "An error occurred while hashing password!"
                                    })
                                })
                        }
                    }).catch(err => {
                        res.json({
                            status: "FAILED",
                            message: "An error occurred while checking for unique user name!"
                        })
                    })
            }
        }).catch(err => {
            console.log(err);
            res.json({
                status: "FAILED",
                message: "An error occurred while checking for existing user!"
            })
        })
}

const sendVerificationEmail = ({ _id, email }, res) => {
    const currentUrl = "http://localhost:8000/";
    const uniqueString = uuidv4() + _id;
    const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: "Please verify your email address",
        html: `<p>Verify your email address to complete the signup and login into you account.</p>
        <p>This link <b> expires in 6 hours.</b></p><p>Press<a href=${currentUrl + "auth/user/verify/" + _id + "/" + uniqueString}> here </a>to proceed. </p>`
    }
    bcrypt.hash(uniqueString, 10)
        .then(hashedUniqueString => {
            const newVerification = new UserVerification({
                userId: _id,
                uniqueString: hashedUniqueString,
                createdAt: Date.now(),
                expiresAt: Date.now() + 21600000,
            })
            newVerification.save()
                .then(result => {
                    transporter.sendMail(mailOptions)
                        .then(() => {
                            res.json({
                                status: "PENDING",
                                message: "verification email sent successfully"
                            })
                        })
                        .catch(err => {
                            console.log(err)
                            res.json({
                                status: "FAILED",
                                message: "verification email failed"
                            })
                        })
                })
                .catch(err => {
                    console.log(err);
                    res.json({
                        status: "FAILED",
                        message: "An error occurred while saving verification data!"
                    })
                })
        }).catch(err => {
            res.json({
                status: "FAILED",
                message: "An error occurred while hashing email data!"
            })
        })
}
module.exports.verifyEmail = async((req, res) => {
    const { userId, uniqueString } = req.params;
    UserVerification.find({ userId })
        .then(result => {
            if (res.length > 0) {
                //user verification record exist so we can proceed
                const { expiresAt } = result[0];
                const hashedUniqueString = result[0].uniqueString;
                if (expiresAt < Date.now()) {
                    //record has expired so we can delete it
                    UserVerification.deleteOne({ userId })
                        .then(result => {
                            User.deleteOne({ _id: userId })
                                .then(() => {
                                    let message = "Link has expired. Please sign up again"
                                    res.redirect(`auth/user/verified/?error=true&message=${message}`);

                                }).catch(err => {
                                    let message = "clearing user with expired unique string failed";
                                    res.redirect(`auth/user/verified/?error=true&message=${message}`)
                                })
                        })
                        .catch(err => {
                            console.log(err);
                            let message = "An error occurred while clearing expired user verification record";
                            res.redirect(`auth/user/verified/?error=true&message=${message}`)
                        })
                } else {
                    //valid record exist so we validate the user string
                    //first compare the hashed unique string
                    bcrypt.compare(uniqueString, hashedUniqueString)
                        .then(result => {
                            if (result) {
                                //string matches
                                User.updateOne({ _id: userId }, { verified: true })
                                    .then(() => {
                                        UserVerification.deleteOne({ userId })
                                            .then(() => {
                                                res.sendFile(path.join(__dirname, "../views/verified.html"))
                                            }).catch(err => {
                                                console.log(err);
                                                let message = "An error occurred while finalizing successful user verification";
                                                res.redirect(`auth/user/verified/?error=true&message=${message}`)
                                            })
                                    }).catch(err => {
                                        console.log(err);
                                        let message = "An error occurred while updating user record to show verified";
                                        res.redirect(`auth/user/verified/?error=true&message=${message}`)
                                    })
                            } else {
                                //record exist but incorrect verification details
                                let message = "incorrect verification details passed. check your inbox.";
                                res.redirect(`auth/user/verified/?error=true&message=${message}`)
                            }
                        }).catch(err => {
                            let message = "An error occurred while comparing unique string";
                            res.redirect(`auth/user/verified/?error=true&message=${message}`)
                        })
                }
            } else {
                //user verification record doesn't exist
                let message = "account record doesn't exist or has been verified already. please signup or login in";
                res.redirect(`auth/user/verified/?error=true&message=${message}`)
            }
        }).catch(err => {
            console.log(err);
            let message = "An error occurred while checking for existing user verification record";
            res.redirect(`auth/user/verified/?error=true&message=${message}`)
        })
})

// verify page route
module.exports.verifyPage = async (req, res) => {
    res.sendFile(path.join(__dirname, "../views/verified.html"))
}

// module.exports.sendEmail = async (req, res) => {
//     const { subject, to, message } = req.body;
//     const mailOptions = {
//         from: process.env.AUTH_EMAIL,
//         to: to,
//         subject: subject,
//         text:message
//     }

//     transporter.sendMail(mailOptions)
//         .then(() => {
//             res.json({
//                 status: "SUCCESS",
//                 message:"Message sent successfully"
//             }).catch(err => {
//                 console.log(err)
//                 res.json({
//                     status: "FAILED",
//                     message: "An error occurred"
//                 })
//         })
//     })
// }


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