const SquareBaseURL = require("../apiConstrains/apiList");
const { v4: uuidv4 } = require('uuid');

const createOrder = async (req, res) => {
  try {
    // Check if req.body is defined
    if (!req.body) {
      return res.status(400).json({ error: "Request body is missing" });
    }
    const { order } = req.body;

    // Check if required fields are present in the request body
    if (!order || !order.location_id) {
      return res.status(400).json({ error: "Invalid order data" });
    }

    // Generate a random UUID for idempotency_key
    const idempotency_key = uuidv4();

    const response = await SquareBaseURL.post("/orders", {
      idempotency_key,
      order,
    });


    // Send the Square API response to the client
    res.json(response.data);
  } catch (error) {
    console.error("Error placing Square order:", error.message);
    if (error.response && error.response.data) {
      console.error("Square API error response:", error.response.data);
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports = {
  createOrder,
};