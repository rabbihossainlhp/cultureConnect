//dependencies....
const db = require('../config/db');



const EmailVerificationCode = {
    tableName:'email_verification_codes',
    async createEmailVerifyTable(){
        const query = `
            CREATE TABLE IF NOT EXISTS email_verification_codes(
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) NOT NULL UNIQUE,
                otp_code VARCHAR(6) NOT NULL,
                user_data JSONB NOT NULL,
                expires_at TIMESTAMPTZ NOT NULL,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                attempts INT DEFAULT 0
            );

            CREATE INDEX IF NOT EXISTS idx_email_verifications_email ON email_verification_codes(email);
            CREATE INDEX IF NOT EXISTS idx_email_verifications_expires_at ON email_verification_codes(expires_at);
        `;

        try{
            await db.query(query);
        }catch(err){
            console.error('Error catching during create email verification code table');
            throw err;
        }
    }
    
};



module.exports = EmailVerificationCode;