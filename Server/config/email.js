//dependencies....
const {Resend} = require('resend');
console.log("RESEND API KEY SET?",process.env.RESEND_API_KEY?"YES":"NO");

const resend = new Resend(process.env.RESEND_API_KEY);

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
            from:'onboarding@resend.dev', 
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