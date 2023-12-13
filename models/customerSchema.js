const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  customerSquareId: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  givenName: { type: String, required: true },
  familyName: { type: String, default: "" },
  emailAddress: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  companyName: { type: String, default: "" },
  password: { type: String },
  verificationCode: { type: String, default: null },
  verificationCodeExpiresAt: { type: Date, default: null },
});

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
