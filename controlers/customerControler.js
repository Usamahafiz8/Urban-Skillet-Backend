const mongoose = require("mongoose");
const crypto = require("crypto");
const axios = require("axios");
const bcrypt = require("bcrypt");
const Customer = require("../models/customerSchema");
const { sendVerificationEmail } = require("../common/emailService");
const SquareBaseURL = require("../apiConstrains/apiList");

const createCustomer = async (req, res) => {
  try {
    const { given_name, family_name, email_address, phone_number, password } =
      req.body;

    // Check if a customer with the provided email or phone number already exists
    const existingCustomer = await Customer.findOne({
      $or: [{ emailAddress: email_address }, { phoneNumber: phone_number }],
    });

    // If a customer with the provided email or phone number exists, log them in
    if (existingCustomer) {
      return res.status(200).json({
        message: "Customer already exists. Log in instead.",
        type: "failure",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification code
    const verificationCode = crypto
      .randomBytes(3)
      .toString("hex")
      .toUpperCase();
    const verificationCodeExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Save the customer data into the MongoDB database with the hashed password
    const savedCustomer = await Customer.create({
      givenName: given_name,
      familyName: family_name || "",
      emailAddress: email_address,
      phoneNumber: phone_number,
      companyName: "",
      password: hashedPassword,
      verificationCode,
      verificationCodeExpiresAt,
    });

    // Send verification email
    await sendVerificationEmail(savedCustomer.emailAddress, verificationCode);

    res.status(201).json({
      message: "Customer created. Check your email for verification.",
      type: "Success",
    });
  } catch (error) {
    console.error("Error:", error);

    if (error.response) {
      console.error("Square API Error Response:", error.response.data);
      res.status(500).json({
        error: "Internal Server Error",
        details: error.response.data.errors,
      });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

const verifyCustomer = async (req, res) => {
  try {
    const { email, verificationCode } = req.body;

    // Find the customer by email address and verification code
    const customer = await Customer.findOne({
      emailAddress: email,
      verificationCode,
      verificationCodeExpiresAt: { $gt: new Date() },
    });

    if (!customer) {
      return res
        .status(400)
        .json({ error: "Invalid verification code or email", type: "failure" });
    }

    // Mark the customer as verified
    customer.isVerified = true;
    customer.verificationCode = null;
    customer.verificationCodeExpiresAt = null;
    await customer.save();

    // Now, you can create the customer in the Square app using the customer data
    const squareApiResponse = await SquareBaseURL.post("/customers", {
      given_name: customer.givenName,
      family_name: customer.familyName || "",
      email_address: customer.emailAddress,
      phone_number: customer.phoneNumber,
    });

    // Extract relevant data from the Square API response
    const squareCustomerData = squareApiResponse.data.customer;

    // Update the customerSquareId in the local database
    customer.customerSquareId = squareCustomerData.id;
    await customer.save();

    res
      .status(200)
      .json({ message: "Customer verified successfully.", type: "Success" });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

const customerLogin = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // Find the customer by email address or phone number
    const customer = await Customer.findOne({
      $or: [{ emailAddress: identifier }, { phoneNumber: identifier }],
    });

    // If the customer is not found, return an error
    if (!customer) {
      return res.status(401).json({
        message: "Invalid email/phone number or password",
        type: "failure",
      });
    }

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, customer.password);

    // If the passwords don't match, return an error
    if (!passwordMatch) {
      return res.status(401).json({
        error: "Invalid email/phone number or password",
        type: "failure",
      });
    }
    console.log("working ");
    // Passwords match, now fetch customer details from Square API
    const squareCustomerResponse = await SquareBaseURL.get(
      `/customers/${customer.customerSquareId}`
    );

    // Extract relevant data from the Square API response
    const squareCustomerData = squareCustomerResponse.data.customer;

    // Return the customer de tails (excluding the password)
    const customerDetails = {
      id: customer.customerSquareId,
      updatedAt: customer.updatedAt,
      givenName: squareCustomerData.given_name,
      familyName: squareCustomerData.family_name || "",
      emailAddress: squareCustomerData.email_address,
      phoneNumber: squareCustomerData.phone_number,
      companyName: squareCustomerData.company_name || "",
    };

    res.status(200).json(customerDetails);
  } catch (error) {
    console.log("working 1", error.response);
    res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
      type: "failure",
    });
  }
};

const createOrUpdateCustomer = async (req, res) => {
  try {
    const { given_name, family_name, email_address, phone_number } = req.body;

    // Check if a customer with the provided email or phone number already exists
    const existingCustomer = await Customer.findOne({
      $or: [{ emailAddress: email_address }, { phoneNumber: phone_number }],
    });

    // If a customer with the provided email or phone number exists, return Square ID
    if (existingCustomer) {
      return res.status(200).json({
        message: "Customer already exists.",
        type: "success",
        customerSquareId: existingCustomer.customerSquareId,
      });
    }

    // Create a new customer in the MongoDB database without verification
    const newCustomer = await Customer.create({
      givenName: given_name,
      familyName: family_name || "",
      emailAddress: email_address,
      phoneNumber: phone_number,
      companyName: "",
    });

    // Now, you can create the customer in the Square app using the customer data
    const squareApiResponse = await SquareBaseURL.post("/customers", {
      given_name: newCustomer.givenName,
      family_name: newCustomer.familyName || "",
      email_address: newCustomer.emailAddress,
      phone_number: newCustomer.phoneNumber,
    });

    // Extract relevant data from the Square API response
    const squareCustomerData = squareApiResponse.data.customer;

    // Update the customerSquareId in the local database
    newCustomer.customerSquareId = squareCustomerData.id;
    await newCustomer.save();

    res.status(201).json({
      message: "Customer created successfully.",
      type: "success",
      customerSquareId: newCustomer.customerSquareId,
    });
  } catch (error) {
    console.error("Error:", error);

    if (error.response) {
      console.error("Square API Error Response:", error.response.data);
      res.status(500).json({
        error: "Internal Server Error",
        details: error.response.data.errors,
      });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

module.exports = {
  createCustomer,
  verifyCustomer,
  customerLogin,
  createOrUpdateCustomer,
};
