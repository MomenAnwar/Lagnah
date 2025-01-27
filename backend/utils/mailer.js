const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({    
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.SENDER_MAIL,
        pass: process.env.SENDER_PASSWORD
    },
    logger: true,
    debug: true,
});

module.exports = { transporter }