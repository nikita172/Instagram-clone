const User = require("../models/User")
const UserVerification = require("../models/UserVerification")

const sms = require("../middlewares/sms")
const bcrypt = require("bcrypt")
const { v4: uuidv4 } = require("uuid")
require("dotenv").config();
const nodemailer = require("nodemailer");
const path = require("path")
const jwt = require("jsonwebtoken")
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const twilioNum = process.env.TWILIO_NUM;
const client = require('twilio')(accountSid, authToken);

//for test purpose
let testAccount = nodemailer.createTestAccount(); //fake smtp server

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'soledad.batz4@ethereal.email',
        pass: 'RFkAkCKrWJRDjZMzEp'
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

//signup with email
module.exports.signupWithEmail = async (req, res) => {
    const { email, password, fullName, userName } = req.body;
    User.find({ email })
        .then((result) => {
            if (result.length) {
                res.json({
                    status: "FAILED",
                    message: "User already exist."
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

const sendVerificationEmail = async ({ _id, email }, res) => {
    const currentUrl = "http://localhost:8000/";
    const uniqueString = uuidv4() + _id;
    const mailOptions = {
        from: "soledad.batz4@ethereal.email",
        to: email,
        subject: "verify your email address",
        html: `<p>Please, Verify your email address to complete the signup and login into you account.</p>
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

//verify email
module.exports.verifyEmail = async (req, res) => {
    const { userId, uniqueString } = req.params;
    UserVerification.find({ userId })
        .then(result => {
            if (result.length > 0) {
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
                                    res.redirect(`/auth/user/verified/?error=true&message=${message}`);
                                }).catch(err => {
                                    let message = "clearing user with expired unique string failed";
                                    res.redirect(`/auth/user/verified/?error=true&message=${message}`)
                                })
                        })
                        .catch(err => {
                            let message = "An error occurred while clearing expired user verification record";
                            res.redirect(`/auth/user/verified/?error=true&message=${message}`)
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
                                                res.redirect(`/auth/user/verified/?error=true&message=${message}`)
                                            })
                                    }).catch(err => {
                                        console.log(err);
                                        let message = "An error occurred while updating user record to show verified";
                                        res.redirect(`/auth/user/verified/?error=true&message=${message}`)
                                    })
                            } else {
                                //record exist but incorrect verification details
                                let message = "incorrect verification details passed. check your inbox.";
                                res.redirect(`/auth/user/verified/?error=true&message=${message}`)
                            }
                        }).catch(err => {
                            let message = "An error occurred while comparing unique string";
                            res.redirect(`/auth/user/verified/?error=true&message=${message}`)
                        })
                }
            } else {
                //user verification record doesn't exist
                let message = "account record doesn't exist or has been verified already. please signup or login in";
                res.redirect(`/auth/user/verified/?error=true&message=${message}`)
            }
        }).catch(err => {
            console.log(err);
            let message = "An error occurred while checking for existing user verification record";
            res.redirect(`/auth/user/verified/?error=true&message=${message}`)
        })
}

// verify page route
module.exports.verifyPage = async (req, res) => {
    res.sendFile(path.join(__dirname, "../views/verified.html"))
}

//resend email for email verification
module.exports.resendEmailVerification = async (req, res) => {
    const { id, email } = req.body;
    User.find({ _id: id })
        .then(result => {
            if (result.length > 0) {
                if (!result[0].verified) {
                    UserVerification.deleteOne({ userId: id })
                        .then(result => {
                            const data = {
                                _id: id,
                                email
                            }
                            sendVerificationEmail(data, res)
                        }).catch(err => {
                            console.log(err)
                            res.json({
                                status: "FAILED",
                                message: "An error occurred while resending email"
                            })
                        })
                } else {
                    UserVerification.deleteOne({ userId: id })
                        .then(result => {
                            res.json({
                                status: "FAILED",
                                message: "Already verified.Please Signin"
                            })
                        })
                }
            } else {
                res.json({
                    status: "FAILED",
                    message: "Please login first!"
                })
            }
        }).catch(err => {
            res.json({
                status: "FAILED",
                message: "Something went wrong while checking the data!"
            })
        })
}

//verify with mobile number
module.exports.verifyMobile = async (req, res) => {
    console.log("verify mobile runs");
    const { userId, uniqueString } = req.body;
    UserVerification.find({ userId })
        .then(result => {
            if (result.length > 0) {
                //user verification record exist so we can proceed
                const { expiresAt } = result[0];
                const hashedUniqueString = result[0].uniqueString;
                if (expiresAt < Date.now()) {
                    //record has expired so we can delete it
                    UserVerification.deleteOne({ userId })
                        .then(result => {
                            //also delete user
                            User.deleteOne({ _id: userId })
                                .then(() => {
                                    res.json({
                                        status: "SUCCESS",
                                        message: "Link has expired. Please sign up again"
                                    })
                                }).catch(err => {
                                    res.json({
                                        status: "FAILED",
                                        message: "clearing user with expired unique string failed"
                                    })
                                })

                        }).catch(err => {
                            res.json({
                                status: "FAILED",
                                message: "An error occurred while clearing expired user verification record"
                            })

                        })
                }
                //valid record exist, so we validate the otp here
                else {
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
                                                res.json({
                                                    status: "SUCCESS",
                                                    message: "User has been verified successfully"
                                                })
                                            }).catch(err => {
                                                console.log(err);
                                                res.json({
                                                    status: "FAILED",
                                                    message: "An error occurred while finalizing successful user verification"
                                                })
                                            })
                                    }).catch(err => {
                                        console.log(err);
                                        res.json({
                                            status: "FAILED",
                                            message: "An error occurred while updating user record to show verified"
                                        })
                                    })
                            } else {
                                //record exist but incorrect verification details
                                res.json({
                                    status: "FAILED",
                                    message: "incorrect verification details passed. check SMS."
                                })
                            }
                        }).catch(err => {
                            res.json({
                                status: "FAILED",
                                message: "An error occurred while comparing unique string"
                            })
                        })
                }
            } else {
                res.json({
                    status: "FAILED",
                    message: "Account record doesn't exist or has been verified already. please signup."
                })

            }
        }).catch(err => {
            console.log(err);
            res.json({
                status: "FAILED",
                message: "something went wrong while existing user verification checking the record"
            })
        })

}
//resend otp for  mobile verification
module.exports.resendMobileVerification = async (req, res) => {
    const { id, mobileNo } = req.body;
    User.find({ _id: id })
        .then(result => {
            console.log(result)
            if (result.length > 0) {
                if (!result[0].verified) {
                    UserVerification.deleteOne({ userId: id })
                        .then(result => {
                            console.log("this runs")
                            console.log(result)
                            const data = {
                                _id: id,
                                mobileNo
                            }
                            sendOTP(data, res)
                        }).catch(err => {
                            console.log(err)
                            res.json({
                                status: "FAILED",
                                message: "An error occurred while resending email"
                            })
                        })
                } else {
                    UserVerification.deleteOne({ userId: id })
                        .then(result => {
                            res.json({
                                status: "FAILED",
                                message: "Already verified.Please Signin"
                            })
                        })
                }
            } else {
                res.json({
                    status: "FAILED",
                    message: "Please login first!"
                })
            }
        }).catch(err => {
            res.json({
                status: "FAILED",
                message: "Something went wrong while checking the data!"
            })
        })
}

//signup with mobile number
module.exports.signupWithMobile = async (req, res) => {
    const { mobileNo, password, userName, fullName } = req.body;

    User.find({ mobileNo })
        .then(result => {
            if (result.length > 0) {
                res.json({
                    status: "FAILED",
                    message: "User has been already registered!"
                })

            } else {
                User.find({ userName })
                    .then(result => {
                        if (result.length > 0) {
                            res.json({
                                status: "FAILED",
                                message: "Username should be unique. Please try with another one!"
                            })
                        } else {
                            bcrypt.hash(password, 10)
                                .then((hashedPassword) => {
                                    const newUser = new User({
                                        userName,
                                        fullName,
                                        mobileNo,
                                        password: hashedPassword
                                    })
                                    newUser.save().then(result => {
                                        sendOTP(result, res)
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
                        console.log(err);
                        res.json({
                            status: "FAILED",
                            message: "Something went wrong while checking for user!"
                        })
                    })



            }
        })

}
const sendOTP = async ({ _id, mobileNo }, res) => {
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(generatedOtp);
    bcrypt.hash(generatedOtp, 10)
        .then(hashedOtp => {
            const newVerification = new UserVerification({
                userId: _id,
                uniqueString: hashedOtp,
                createdAt: Date.now(),
                expiresAt: Date.now() + 21600000,
            })
            newVerification.save()
                .then(result => {
                    client.messages
                        .create({
                            body: generatedOtp,
                            from: twilioNum,
                            to: `+91${mobileNo}`
                        })
                        .then(result => {
                            res.json({
                                status: "PENDING",
                                message: "OTP has been sent successfully"
                            })
                        }).catch(err => {
                            console.log(err)
                            res.json({
                                status: "FAILED",
                                message: "OTP verification failed"
                            })
                        })
                }).catch(err => {
                    console.log(err);
                    res.json({
                        status: "FAILED",
                        message: "An error occurred while saving verification data!"
                    })
                })
        }).catch(err => {
            res.json({
                status: "FAILED",
                message: "An error occurred while hashing OTP data!"
            })
        })
}

//verify account with otp


//sign in with username, email, mobileNo
module.exports.signIn = async (req, res) => {
    const { user, password } = req.body;
    User.find({
        $or: [
            { userName: user },
            { email: user },
            { mobileNo: user }
        ]
    }).then(result => {
        if (result.length > 0) {
            const hashedPassword = result[0].password;
            const userName = result[0].userName;
            const userId = result[0]._id;
            const verified = result[0].verified;
            bcrypt.compare(password, hashedPassword)
                .then(result => {
                    if (result) {
                        if (verified) {
                            const token = jwt.sign(
                                {
                                    userName,
                                    userId
                                },
                                process.env.TOKEN_SECRET,
                                { expiresIn: 365 * 60 * 24 * 1000 }
                            )
                            res.json({
                                status: "SUCCESS",
                                message: "Sign In successfully",
                                token,
                                userId
                            })
                        } else {
                            res.json({
                                status: "FAILED",
                                message: "You are not verified yet. Please verified your account!"
                            })
                        }
                    } else {
                        res.json({
                            status: "FAILED",
                            message: "Incorrect password!"
                        })
                    }
                }).catch(err => {
                    console.log(err);
                    res.json({
                        status: "FAILED",
                        message: "Something went wrong while validating the password!"
                    })
                })
        } else {
            res.json({
                status: "FAILED",
                message: "User does not exist. Please check your {user name, email or phone no.} properly!"
            })
        }
    }).catch(err => {
        console.log(err);
        res.json({
            status: "FAILED",
            message: "Something went wrong while finding credentials!"
        })
    })
}