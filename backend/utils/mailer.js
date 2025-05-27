const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({    
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    from: process.env.SENDER_MAIL,
    name: 'لجنة الزكاة والصدقات ببهنيا',
    auth: {
        user: process.env.SENDER_MAIL,
        pass: process.env.SENDER_PASSWORD
    },
    logger: true,
    debug: true,
});

module.exports = { transporter }