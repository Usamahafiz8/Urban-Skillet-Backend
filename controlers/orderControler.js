// orderController.js

const SquareBaseURL = require('../apiConstrains/apiList');
const { v4: uuidv4 } = require('uuid');

const createOrderAndProcessPayment = async (req, res) => {
  try {
    // Check if req.body is defined
    if (!req.body) {
      return res.status(400).json({ error: "Request body is missing" });
    }

    const { order, sourceID, amount } = req.body;

    // Check if required fields are present in the order
    if (!order || !order.location_id) {
      return res.status(400).json({ error: "Invalid order data" });
    }

    // Generate a random UUID for idempotency_key
    const idempotency_key = uuidv4();

    // Create order
    const orderResponse = await SquareBaseURL.post("/orders", {
      idempotency_key,
      order,
    });

    // Process payment
    const paymentIdempotencyKey = uuidv4();

    const paymentRequest = {
      source_id: sourceID,
      idempotency_key: paymentIdempotencyKey,
      amount_money: {
        amount: amount,
        currency: 'USD',
      },
      order_id: orderResponse.data.order.id, // Use the order ID from the order response
    };

    const paymentResponse = await SquareBaseURL.post('/payments', paymentRequest);

    // Send the Square API response to the client
    res.json({
      order: orderResponse.data,
      payment: paymentResponse.data,
    });
  } catch (error) {
    console.error("Error creating order and processing payment:", error.message);
    if (error.response && error.response.data) {
      console.error("Square API error response:", error.response.data);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = {
  createOrderAndProcessPayment,
};
