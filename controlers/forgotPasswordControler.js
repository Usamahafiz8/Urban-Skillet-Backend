const bcrypt = require("bcrypt");
const Customer = require("../models/customerSchema");
const { sendVerificationEmail } = require("../common/emailService");

/**
 * Generate a random 6-digit OTP
 * @returns {string} - Random OTP
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Controller for initiating the forgot password process
 * - Takes the user's email, generates an OTP, sends it via email, and saves it in the database
 */
const forgotPasswordInitiate = async (req, res) => {
  try {
    const { email_address } = req.body;

    // Check if the customer with the provided email exists
    const existingCustomer = await Customer.findOne({
      emailAddress: email_address,
    });

    if (!existingCustomer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // Generate a verification code
    const verificationCode = generateOTP();

    // Send the verification code to the customer's email
    await sendVerificationEmail(email_address, verificationCode);

    // Save the verification code and its expiration time in the database
    existingCustomer.verificationCode = verificationCode;
    existingCustomer.verificationCodeExpiresAt = new Date(
      Date.now() + 600 * 1000
    ); // Set expiration to one minute from now
    await existingCustomer.save();
    console.log(existingCustomer);
    // Schedule the deletion of the verification code after one minute
    setTimeout(async () => {
      existingCustomer.verificationCode = undefined;
      existingCustomer.verificationCodeExpiresAt = undefined;
      await existingCustomer.save();
    }, 60 * 1000);

    // Return a response indicating that the verification email has been sent
    res
      .status(200)
      .json({
        message: "Verification email sent. Check your email for the code.",
      });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

/**
 * Controller for verifying the OTP and updating the password
 */
const forgotPasswordComplete = async (req, res) => {
  try {
    const { email_address, verificationCode, new_password } = req.body;

    // Find the customer by email address
    const existingCustomer = await Customer.findOne({
      emailAddress: email_address,
    });
    console.log(existingCustomer);
    if (!existingCustomer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    console.log(verificationCode, "given");
    console.log(existingCustomer.verificationCode, "given");
    // Check if the verification code matches
    if (existingCustomer.verificationCode !== verificationCode) {
      return res.status(400).json({ error: "Invalid verification code" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(new_password, 10);

    // Update the password in the database
    existingCustomer.password = hashedPassword;
    // Clear the verification code after successful password update
    existingCustomer.verificationCode = undefined;
    await existingCustomer.save();

    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

/**
 * Controller for verifying the OTP and updating the password
 */
const VarifyOTP = async (req, res) => {
    try {
      const { email_address, verificationCode } = req.body;
  
      // Find the customer by email address
      const existingCustomer = await Customer.findOne({
        emailAddress: email_address,
      });
      console.log(existingCustomer);
      if (!existingCustomer) {
        return res.status(404).json({ error: "Customer not found" });
      }
      console.log(verificationCode, "given");
      console.log(existingCustomer.verificationCode, "given");
      // Check if the verification code matches
      if (existingCustomer.verificationCode !== verificationCode) {
        return res.status(400).json({ error: "Invalid verification code" });
      }
  


      // Clear the verification code after successful password update
      existingCustomer.verificationCode = undefined;
      await existingCustomer.save();
  
      res.status(200).json({ message: "Verification code" });
    } catch (error) {
      console.error("Error:", error);
      res
        .status(500)
        .json({ error: "Internal Server Error", details: error.message });
    }
  };

module.exports = {
  forgotPasswordInitiate,
  forgotPasswordComplete,
  VarifyOTP
};
