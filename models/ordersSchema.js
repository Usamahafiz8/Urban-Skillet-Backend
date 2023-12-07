const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  locationId: { type: String, required: true },
  lineItems: [
    {
      uid: String,
      quantity: String,
      name: String,
      basePriceMoney: {
        amount: Number,
        currency: String,
      },
      grossSalesMoney: {
        amount: Number,
        currency: String,
      },
      totalTaxMoney: {
        amount: Number,
        currency: String,
      },
      totalDiscountMoney: {
        amount: Number,
        currency: String,
      },
      totalMoney: {
        amount: Number,
        currency: String,
      },
      variationTotalPriceMoney: {
        amount: Number,
        currency: String,
      },
      itemType: String,
      totalServiceChargeMoney: {
        amount: Number,
        currency: String,
      },
    },
  ],
  fulfillments: [
    {
      uid: String,
      type: String,
      state: String,
      deliveryDetails: {
        recipient: {
          displayName: String,
          phoneNumber: String,
          address: {
            addressLine1: String,
            country: String,
          },
        },
        deliverAt: Date,
        courierSupportPhoneNumber: String,
        managedDelivery: Boolean,
      },
      pickupDetails: {
        pickupAt: Date,
        recipient: {
          displayName: String,
        },
      },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  state: String,
  version: Number,
  totalTaxMoney: {
    amount: Number,
    currency: String,
  },
  totalDiscountMoney: {
    amount: Number,
    currency: String,
  },
  totalTipMoney: {
    amount: Number,
    currency: String,
  },
  totalMoney: {
    amount: Number,
    currency: String,
  },
  totalServiceChargeMoney: {
    amount: Number,
    currency: String,
  },
  netAmounts: {
    totalMoney: {
      amount: Number,
      currency: String,
    },
    taxMoney: {
      amount: Number,
      currency: String,
    },
    discountMoney: {
      amount: Number,
      currency: String,
    },
    tipMoney: {
      amount: Number,
      currency: String,
    },
    serviceChargeMoney: {
      amount: Number,
      currency: String,
    },
  },
  source: {
    name: String,
  },
  customerId: String,
  netAmountDueMoney: {
    amount: Number,
    currency: String,
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
