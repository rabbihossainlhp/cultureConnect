//dependencies....
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
})

//function to send mail..
const sendOtpMail = async (email,otp) =>{
    try{
        //tamplate
        const mailTemplate = `
            <h2>Email Verification</h2>
            <p>Your verification code is:</p>
            <h1 style="color:#ff6b35; font-size:32px; letter-spacing:5px;">${otp}</h1>
            <p>This code expires in <strong>10 minutes</strong></p>
            <p>If you didn't request this please ignore it.</p>
        `;

        const response = await resend.emails.send({
            from:process.env.EMAIL_USER,
            to:email,
            subject:'CultureConnect - Email Verification Code',
            html:mailTemplate,
        });

        console.log("Resend Response: ",response)
        console.log("OTP sent to: ",email);

        return true;
    }catch(err){
        console.error('OTP sending error: ',err);
        return false;
    }
};


module.exports = {sendOtpMail};