const SquareBaseURL = require("../apiConstrains/apiList");
const axios = require("axios");
const bcrypt = require("bcrypt");
const Customer = require('../models/customerSchema'); 
const { sendVerificationEmail } = require("../common/emailService");

const createCustomer = async (req, res) => {
  try {
    // Extract customer data from the request body
    const {
      given_name,
      family_name,
      email_address,
      phone_number,
      password,
    } = req.body;

    // Check if a customer with the provided email or phone number already exists
    const existingCustomer = await Customer.findOne({
      $or: [{ emailAddress: email_address }, { phoneNumber: phone_number }],
    });

    // If a customer with the provided email or phone number exists, log them in
    if (existingCustomer) {
      return res.status(200).json({ message: "Customer already exists. Log in instead." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // Adjust the saltRounds as needed

    // Make a request to Square Up API to create a customer
    const squareApiResponse = await SquareBaseURL.post("/customers", {
      given_name,
      family_name,
      email_address,
      phone_number,
    });

    // Extract relevant data from the Square API response
    const squareCustomerData = squareApiResponse.data.customer;

    // Save the customer data into the MongoDB database with the hashed password
    const savedCustomer = await Customer.create({
      customerSquareId: squareCustomerData.id,
      createdAt: squareCustomerData.created_at,
      updatedAt: squareCustomerData.updated_at,
      givenName: squareCustomerData.given_name,
      familyName: squareCustomerData.family_name || '',
      emailAddress: squareCustomerData.email_address,
      phoneNumber: squareCustomerData.phone_number,
      companyName: squareCustomerData.company_name || '',
      password: hashedPassword,
    });

    // Handle the Square Up API response and the saved customer data as needed
    res.status(201).json(savedCustomer);
  } catch (error) {
    console.error("Error:", error);

    // Log the Square API response in case of an error
    if (error.response) {
      console.error("Square API Error Response:", error.response.data);
    }

    res.status(500).json({ error: "Internal Server Error", details: error.response.data.errors });
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
      return res.status(401).json({ error: "Invalid email/phone number or password" });
    }

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, customer.password);

    // If the passwords don't match, return an error
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email/phone number or password" });
    }

    // Passwords match, now fetch customer details from Square API
    const squareCustomerResponse = await SquareBaseURL.get(`/customers/${customer.customerSquareId}`);

    // Extract relevant data from the Square API response
    const squareCustomerData = squareCustomerResponse.data.customer;

    // Return the customer details (excluding the password)
    const customerDetails = {
      id: customer.customerSquareId,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
      givenName: squareCustomerData.given_name,
      familyName: squareCustomerData.family_name || '',
      emailAddress: squareCustomerData.email_address,
      phoneNumber: squareCustomerData.phone_number,
      companyName: squareCustomerData.company_name || '',
    };

    res.status(200).json(customerDetails);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};



module.exports = {
  createCustomer,customerLogin,
};
