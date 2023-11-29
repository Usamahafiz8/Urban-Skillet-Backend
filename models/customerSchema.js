const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  customerSquareId: { type: String, required: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
  givenName: { type: String, required: true },
  familyName: { type: String, default: '' },
  emailAddress: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  companyName: { type: String, default: '' },
  password: { type: String, required: true },
  verificationCode: { type: String, default: null },  
  verificationCodeExpiresAt: { type: Date, default: null },  
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
