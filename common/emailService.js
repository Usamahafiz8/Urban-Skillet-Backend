// emailService.js

const nodemailer = require("nodemailer");

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "rapidev.softwares@gmail.com", 
    pass: "xfcljbvpghqzabnw", 
  },    
});
// EMAIL_PASSWORD=xfcljbvpghqzabnw
// EMAIL_ADDRESS=rapidev.softwares@gmail.com


// Function to send an email with a verification code
const sendVerificationEmail = async (to, verificationCode) => {
  const mailOptions = {
    from: "rapidev.softwares@gmail.com", 
    to,
    subject: "Verification Code for Your Account",
    text: `Your verification code is: ${verificationCode}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${to}`);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
};

module.exports = {
  sendVerificationEmail,
};
