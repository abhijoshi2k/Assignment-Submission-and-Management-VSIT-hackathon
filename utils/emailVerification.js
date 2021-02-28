const nodemailer = require('nodemailer')
const User = require('./schema/userSchema');
const Crypto = require('crypto')

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
  

const sendWelcomeMail = async(userEmail) => {
    try{
        // Getting the User to whom we have to send the mail
        const user = await User.findOne({ email: user.username}) // APPEND HERE
        const confirmationHash = generateHash()
        user.emailValidationHash = confirmationHash
        await user.save()
        // console.log(confirmationHash)
    
    
        // Testing
    
        // let testAccount = await nodemailer.createTestAccount();
        // let transporter = nodemailer.createTransport({
        //     host: "smtp.ethereal.email",
        //     port: 587,
        //     secure: false,
        //     auth: {
        //         user: testAccount.user, // generated ethereal user
        //         pass: testAccount.pass, // generated ethereal password
        //     },
        // })
    
        let info = await transporter.sendMail({
            from: "HabitAble Team <a.habitable_team@yahoo.com>",    // Yahoo Mail
            to: user.email,                                             // userEmail
            subject: "Welcome to HabitAble",
            text: "Welcome",                   
            html: `<b>Your Confirmation Code is </b> 
                    <a>${confirmationHash}</a>`     // Link
        })
    
        // console.log("Message sent: %s", info.messageId);
        // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    }catch(e){
        res.status(500)
        // console.log(e)
    }
}

module.exports = {
    sendWelcomeMail
}