const User = require("../models/User")
const UserVerification = require("../models/UserVerification")
const PasswordReset = require("../models/PasswordReset")
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

//signup with email
module.exports.signupWithEmail = async (req, res) => {
    const { email, password, fullName, userName } = req.body;
    User.find({ email })
        .then((result) => {
            if (result.length) {
                if (result[0].verified) {
                    res.json({
                        status: "FAILED",
                        message: "User already exist. Please login!"
                    })
                }
                else {
                    res.json({
                        status: "FAILED",
                        message: "Oops! Looks like you didn't verify your account. Please verify your account. Check Inbox."
                    })
                }
            }
            else {
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
        from: process.env.AUTH_EMAIL,
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

// verify page route
module.exports.verifyPage = async (req, res) => {
    res.sendFile(path.join(__dirname, "../views/verified.html"))
}

//signup with mobile number
module.exports.signupWithMobile = async (req, res) => {
    const { mobileNo, password, userName, fullName } = req.body;
    User.find({ mobileNo })
        .then(result => {
            if (result.length > 0) {
                if (result[0].verified) {
                    res.json({
                        status: "FAILED",
                        message: "User has been already registered!"
                    })
                }
                else {
                    res.json({
                        status: "FAILED",
                        message: "Oops! Looks like you didn't verify your account. Please verify your OTP."
                    })
                }
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

//reset password stuff for user verified with their email
module.exports.resetPasswordEmailRequest = async (req, res) => {
    const { email, redirectUrl } = req.body;
    //check if email exist or not
    User.find({ email })
        .then(data => {
            if (data.length) {
                if (!data[0].verified) {
                    res.json({
                        status: "FAILED",
                        message: "Email hasn't been verified yet. check your inbox"
                    })
                } else {
                    //send email to reset password
                    sendEmailReset(data[0], redirectUrl, res);
                }
            } else {
                res.json({
                    status: "FAILED",
                    message: "No account find with supplied email"
                })
            }
        }).catch(err => {
            console.log(err);
            res.json({
                status: "FAILED",
                message: "An error occurred while checking for existing email"
            })
        })
}

const sendEmailReset = async ({ _id, email }, redirectUrl, res) => {
    const resetString = uuidv4() + _id;
    //clear the existing reset password record
    PasswordReset.deleteMany({ userId: _id })
        .then(result => {
            //reset record deleted successfully now we can send mail
            //redirect url would be the frontend localhost which we want to render after the reset password url
            const mailOptions = {
                from: "lillian70@ethereal.email",
                to: email,
                subject: "Password Reset",
                html: `<p>We heard that you lost the password. </p>
            <p>Don't worry use the below link to reset it.</p>
            <p>This link <b> expires in 60 minutes.</b></p><p>Press<a href=${redirectUrl + _id + "/" + resetString}> here </a>to proceed. </p>`
            }
            bcrypt.hash(resetString, 10)
                .then(hashedResetString => {
                    // set values in password reset collection
                    const newPasswordReset = new PasswordReset({
                        userId: _id,
                        resetString: hashedResetString,
                        createdAt: Date.now(),
                        expiresAt: Date.now() + 3600000
                    })
                    newPasswordReset.save()
                        .then(() => {
                            transporter.sendMail(mailOptions)
                                .then(() => {
                                    res.json({
                                        status: "PENDING",
                                        message: "Password reset email sent"
                                    })
                                })
                                .catch(err => {
                                    res.json({
                                        status: "FAILED",
                                        message: "An error occurred while sending the mail for reset password"
                                    })
                                })
                        }).catch(err => {
                            console.log(err);
                            res.json({
                                status: "FAILED",
                                message: "An error occurred while saving the  password reset data"
                            })
                        })
                }).catch(err => {
                    res.json({
                        status: "FAILED",
                        message: "An error occurred while hashing the reset string"
                    })
                })
        }).catch(err => {
            res.json({
                status: "FAILED",
                message: "An error occurred while deleting the existing reset password record"
            })
        })
}

//actual reset password 
//that api runs when user write their new password and submit the form
module.exports.resetPasswordEmailVerification = async (req, res) => {
    const { userId, resetString, newPassword } = req.body;
    PasswordReset.find({ userId })
        .then(result => {
            if (result.length) {
                //password reset record exist so we can proceed
                const { expiresAt } = result[0];
                //check if the password is expires?
                if (expiresAt < Date.now()) {
                    //password is expired
                    PasswordReset.deleteOne({ userId })
                        .then(result => {
                            //reset record deleted successfully
                            res.json({
                                status: "FAILED",
                                message: "Password reset link expired!"
                            })
                        }).catch(err => {
                            res.json({
                                status: "FAILED",
                                message: "An error occurred while deleting the expires reset password record"
                            })
                        })
                } else {
                    //valid record present so we can proceed
                    //first compare the hashed reset string
                    bcrypt.compare(resetString, result[0].resetString)
                        .then(result => {
                            if (result) {
                                //strings matched
                                //hashed the password and update the user with new password
                                bcrypt.hash(newPassword, 10)
                                    .then(hashedPassword => {
                                        User.updateOne({ _id: userId }, { password: hashedPassword })
                                            .then(() => {
                                                //update complete now we can delete reset record
                                                PasswordReset.deleteOne({ userId })
                                                    .then(() => {
                                                        //both user and password reset record updates
                                                        res.json({
                                                            status: "SUCCESS",
                                                            message: "Password updated successfully"
                                                        })
                                                    }).catch(err => {
                                                        console.log(err)
                                                        res.json({
                                                            status: "FAILED",
                                                            message: "An error occurred while finalizing reset password."
                                                        })
                                                    })
                                            }).catch(err => {
                                                console.log(err)
                                                res.json({
                                                    status: "FAILED",
                                                    message: "Failed to reset your password. Try again!"
                                                })
                                            })
                                    }).catch(err => {
                                        res.json({
                                            status: "FAILED",
                                            message: "An error occurred while hashing the new password. Try again!"
                                        })
                                    })
                            } else {
                                //incorrect reset string
                                res.json({
                                    status: "FAILED",
                                    message: "Incorrect reset string. check you inbox properly"
                                })
                            }
                        }).catch(err => {
                            res.json({
                                status: "FAILED",
                                message: "An error occurred while comparing the resetString "
                            })
                        })
                }
            } else {
                res.json({
                    status: "FAILED",
                    message: "Reset password record does not exist! try again."
                })
            }
        }).catch(err => {
            res.json({
                status: "FAILED",
                message: "An error occurred while searching the existing reset password record"
            })
        })
}

//reset password stuff for user verified with their mobile number
module.exports.resetPasswordMobileOtpRequest = async (req, res) => {
    const { mobileNo } = req.body;
    //check if mobileNo exist or not
    User.find({ mobileNo })
        .then(data => {
            if (data.length) {
                if (!data[0].verified) {
                    res.json({
                        status: "FAILED",
                        message: "mobile number hasn't been verified yet."
                    })
                } else {
                    //send email to reset password
                    sendMobileReset(data[0], res);
                }
            } else {
                res.json({
                    status: "FAILED",
                    message: "No account find with supplied mobile number"
                })
            }
        }).catch(err => {
            console.log(err);
            res.json({
                status: "FAILED",
                message: "An error occurred while checking for existing mobile number"
            })
        })
}

const sendMobileReset = async ({ _id, mobileNo }, res) => {
    const resetString = Math.floor(100000 + Math.random() * 900000).toString();
    //clear the existing reset password record
    PasswordReset.deleteMany({ userId: _id })
        .then(result => {
            bcrypt.hash(resetString, 10)
                .then(hashedResetString => {
                    const newPasswordReset = new PasswordReset({
                        userId: _id,
                        resetString: hashedResetString,
                        createdAt: Date.now(),
                        expiresAt: Date.now() + 3600000
                    })
                    newPasswordReset.save()
                        .then(() => {
                            client.messages
                                .create({
                                    body: "Forget Password? Here is your OTP- " + resetString,
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
                                message: "An error occurred while saving the  password reset data"
                            })
                        })
                }).catch(err => {
                    res.json({
                        status: "FAILED",
                        message: "An error occurred while hashing the reset string"
                    })
                })
        }).catch(err => {
            res.json({
                status: "FAILED",
                message: "An error occurred while deleting the existing reset password record"
            })
        })
}

//verification of the otp send to change password with mobile
module.exports.resetPasswordMobileOtpVerification = async (req, res) => {
    const { mobileNo, resetString, newPassword } = req.body;
    User.find({ mobileNo })
        .then((result) => {
            if (result) {
                console.log(result)
                const userId = result[0]._id;
                PasswordReset.find({ userId })
                    .then(result => {
                        if (result.length) {
                            //password reset record exist so we can proceed
                            const { expiresAt } = result[0];
                            //check if the password is expires?
                            if (expiresAt < Date.now()) {
                                //password is expired
                                PasswordReset.deleteOne({ userId })
                                    .then(result => {
                                        //reset record deleted successfully
                                        res.json({
                                            status: "FAILED",
                                            message: "Password reset OTP expired!"
                                        })
                                    }).catch(err => {
                                        res.json({
                                            status: "FAILED",
                                            message: "An error occurred while deleting the expires reset password record"
                                        })
                                    })
                            } else {
                                //valid record present so we can proceed
                                //first compare the hashed reset string
                                bcrypt.compare(resetString, result[0].resetString)
                                    .then(result => {
                                        if (result) {
                                            //strings matched
                                            //hashed the password and update the user with new password
                                            bcrypt.hash(newPassword, 10)
                                                .then(hashedPassword => {
                                                    User.updateOne({ _id: userId }, { password: hashedPassword })
                                                        .then(() => {
                                                            //update complete now we can delete reset record
                                                            PasswordReset.deleteOne({ userId })
                                                                .then(() => {
                                                                    //both user and password reset record updates
                                                                    res.json({
                                                                        status: "SUCCESS",
                                                                        message: "Password updated successfully"
                                                                    })
                                                                }).catch(err => {
                                                                    console.log(err)
                                                                    res.json({
                                                                        status: "FAILED",
                                                                        message: "An error occurred while finalizing reset password."
                                                                    })
                                                                })
                                                        }).catch(err => {
                                                            console.log(err)
                                                            res.json({
                                                                status: "FAILED",
                                                                message: "Failed to reset your password. Try again!"
                                                            })
                                                        })
                                                }).catch(err => {
                                                    res.json({
                                                        status: "FAILED",
                                                        message: "An error occurred while hashing the new password. Try again!"
                                                    })
                                                })
                                        } else {
                                            //incorrect reset string
                                            res.json({
                                                status: "FAILED",
                                                message: "Incorrect reset string. check your inbox properly"
                                            })
                                        }
                                    }).catch(err => {
                                        res.json({
                                            status: "FAILED",
                                            message: "An error occurred while comparing the resetString "
                                        })
                                    })
                            }
                        } else {
                            res.json({
                                status: "FAILED",
                                message: "Reset password record does not exist!.Please request for the otp first."
                            })
                        }
                    }).catch(err => {
                        res.json({
                            status: "FAILED",
                            message: "An error occurred while searching the existing reset password record"
                        })
                    })
            } else {
                res.json({
                    status: "FAILED",
                    message: "User does not exist with this mobile number"
                })
            }
        }).catch(err => {
            console.log(err);
            res.json({
                status: "FAILED",
                message: "Something went wrong while finding user.Please try again!"
            })
        })
}