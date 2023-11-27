// // paymentController.js

// const SquareBaseURL = require('../apiConstrains/apiList'); // Update the path accordingly
// const { v4: uuidv4 } = require('uuid');

// const processPayment = async (req, res) => {
//   try {
//     // Check if req.body is defined
//     if (!req.body) {
//       return res.status(400).json({ error: "Request body is missing" });
//     }

//     const { orderID, sourceID, amount } = req.body;

//     // Process payment
//     const idempotencyKey = uuidv4();

//     const paymentRequest = {
//       source_id: sourceID,
//       idempotency_key: idempotencyKey,
//       amount_money: {
//         amount: amount,
//         currency: 'USD',
//       },
//       order_id: orderID,
//     };

//     const response = await SquareBaseURL.post('/payments', paymentRequest);

//     // Send the Square API response to the client
//     res.json(response.data);
//   } catch (error) {
//     console.error("Error processing payment:", error.message);
//     if (error.response && error.response.data) {
//       console.error("Square API error response:", error.response.data);
//       res.status(500).json({ error: "Internal Server Error" });
//     } else {
//       res.status(400).json({ error: error.message });
//     }
//   }
// };

// module.exports = {
//   processPayment,
// };
