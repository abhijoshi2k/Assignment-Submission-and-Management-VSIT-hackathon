const nodemailer = require('nodemailer')
const User = require('../schema/userSchema');
const Crypto = require('crypto');

// Production
let transporter = nodemailer.createTransport({
    host: `${process.env.host}`,
    port: process.env.mailPort,
    service:'yahoo',
    secure: false,
    auth: {
        user: `${process.env.adminMail}`, // Production Mail
        pass: `${process.env.adminPass}`, // Production Mail Pass
    },
    debug: false,
    // logger: true
})

var generateHash = (size = 6) => {  
    return Crypto
      .randomBytes(size)
      .toString('hex')
      .slice(0, size)
}
  

const sendWelcomeMail = async(userEmail, user) => {
    try{
        // Getting the User to whom we have to send the mail
        console.log(userEmail)
        const confirmationHash = generateHash()
        user.emailValidationHash = confirmationHash
        await user.save()
    
        let info = await transporter.sendMail({
            from: "HabitAble Team <a.habitable_team@yahoo.com>",    // Yahoo Mail
            to: userEmail,                                             // userEmail
            subject: "Welcome to HabitAble",
            text: "Welcome",                   
            html: `<b>Your Confirmation Code is </b> 
                    <a>${confirmationHash}</a>`     // Link
        })

        console.log("Mail Sent")

    }catch(e){
        console.log(e)
    }
}

module.exports = {
    sendWelcomeMail
}