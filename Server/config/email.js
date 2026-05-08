//dependencies....
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host:'smtp.gmail.com',
    port:587,
    secure:false,
    requireTLS:false,    
    family:4,
    connectionTimeout:20000,
    greetingTimeout:20000,
    socketTimeout:20000,
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    },
    tls:{
        minVersion:'TLSv1.2',
    }

});


transporter.verify((err,success)=>{
        if(err){
            console.log("SMTP verify Failed:",err);
        }else{
            console.log("SMTP transporter ready");
        }
})

//function to send mail..
const sendOtpMail = async (receipientEmail,otp) =>{
    try{
        //tamplate
        const mailTemplate = `
            <h2>Email Verification</h2>
            <p>Your verification code is:</p>
            <h1 style="color:#ff6b35; font-size:32px; letter-spacing:5px;">${otp}</h1>
            <p>This code expires in <strong>10 minutes</strong></p>
            <p>If you didn't request this please ignore it.</p>
        `;

        const mailOptions = {
            from:process.env.EMAIL_USER,
            to:receipientEmail,
            subject:'CultureConnect - Email Verification Code',
            html:mailTemplate,
        };

        const result = await transporter.sendMail(mailOptions);
        console.log("OTP sent successfully! ",result.messageId);

        return true;
    }catch(err){
        console.error('OTP sending error: ',err);
        return false;
    }
};


module.exports = {sendOtpMail};