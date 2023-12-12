const SquareBaseURL = require("../apiConstrains/apiList");
const { v4: uuidv4 } = require("uuid");
const Order = require("../models/ordersSchema");

const createOrderAndProcessPayment = async (req, res) => {
  try {
    // Check if req.body is defined
    if (!req.body) {
      return res.status(400).json({ error: "Request body is missing" });
    }

    const { order, sourceID, amount, location_id } = req.body;

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
        currency: "USD",
      },
      order_id: orderResponse.data.order.id,
      location_id: location_id,
    };

    const paymentResponse = await SquareBaseURL.post(
      "/payments",
      paymentRequest
    );

    // Save the order response to the database
    const savedOrder = await Order.create({
      orderId: orderResponse.data.order.id,
      locationId: orderResponse.data.order.location_id,
      lineItems: orderResponse.data.order.line_items,
      fulfillments: JSON.stringify(orderResponse.data.order.fulfillments),
      createdAt: orderResponse.data.order.created_at,
      updatedAt: orderResponse.data.order.updated_at,
      state: orderResponse.data.order.state,
      version: orderResponse.data.order.version,
      totalTaxMoney: orderResponse.data.order.total_tax_money,
      totalDiscountMoney: orderResponse.data.order.total_discount_money,
      totalTipMoney: orderResponse.data.order.total_tip_money,
      totalMoney: orderResponse.data.order.total_money,
      totalServiceChargeMoney:
        orderResponse.data.order.total_service_charge_money,
      netAmounts: orderResponse.data.order.net_amounts,
      source: orderResponse.data.order.source,
      customerId: orderResponse.data.order.customer_id,
      netAmountDueMoney: orderResponse.data.order.net_amount_due_money,
    });

    // Send the Square API response, saved order, and payment response to the client
    res.json({
      order: orderResponse.data,
      payment: paymentResponse.data,
      savedOrder,
    });
  } catch (error) {
    console.error(
      "Error creating order and processing payment:",
      error.message
    );
    if (error.response && error.response.data) {
      console.error("Square API error response:", error.response.data);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
};

// Add a new controller function for order history
const getOrderHistory = async (req, res) => {
  try {
    const { customerId } = req.params;

    // Fetch orders from the database based on customer ID
    const orders = await Order.find({ customerId });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching order history:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createOrderForInHouse = async (req, res) => {
  try {
    // Check if req.body is defined
    if (!req.body) {
      return res.status(400).json({ error: "Request body is missing" });
    }

    const { order, sourceID, amount, location_id } = req.body;

    // Check if required fields are present in the order
    if (!order || !order.location_id) {
      return res.status(400).json({ error: "Invalid order data" });
    }

    // Check if customer_id is present in the order
    const { customer_id } = order;
    let customerSquareId;

    if (customer_id) {
      // If customer_id is provided, use it
      customerSquareId = customer_id;
    } else {
      // If customer_id is not provided, create or update the customer
      const { given_name, family_name, email_address, phone_number } =
        order.recipient;

      // Check if a customer with the provided email or phone number already exists
      const existingCustomer = await Customer.findOne({
        $or: [{ emailAddress: email_address }, { phoneNumber: phone_number }],
      });

      if (existingCustomer) {
        // If customer exists, use the existing customerSquareId
        customerSquareId = existingCustomer.customerSquareId;
      } else {
        // If customer does not exist, create a new customer
        const createCustomerResponse = await createOrUpdateCustomer({
          body: {
            given_name,
            family_name,
            email_address,
            phone_number,
          },
        });

        if (createCustomerResponse.status !== 201) {
          return res.status(500).json({
            error: "Error creating or updating customer",
          });
        }

        customerSquareId = createCustomerResponse.data.customerSquareId;
      }
    }

    // Generate a random UUID for idempotency_key
    const idempotency_key = uuidv4();

    // Update order with customerSquareId
    order.customer_id = customerSquareId;

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
        currency: "USD",
      },
      order_id: orderResponse.data.order.id,
      location_id: location_id,
    };

    const paymentResponse = await SquareBaseURL.post(
      "/payments",
      paymentRequest
    );

    // Save the order response to the database
    const savedOrder = await Order.create({
      orderId: orderResponse.data.order.id,
      locationId: orderResponse.data.order.location_id,
      lineItems: orderResponse.data.order.line_items,
      fulfillments: JSON.stringify(orderResponse.data.order.fulfillments),
      createdAt: orderResponse.data.order.created_at,
      updatedAt: orderResponse.data.order.updated_at,
      state: orderResponse.data.order.state,
      version: orderResponse.data.order.version,
      totalTaxMoney: orderResponse.data.order.total_tax_money,
      totalDiscountMoney: orderResponse.data.order.total_discount_money,
      totalTipMoney: orderResponse.data.order.total_tip_money,
      totalMoney: orderResponse.data.order.total_money,
      totalServiceChargeMoney:
        orderResponse.data.order.total_service_charge_money,
      netAmounts: orderResponse.data.order.net_amounts,
      source: orderResponse.data.order.source,
      customerId: orderResponse.data.order.customer_id,
      netAmountDueMoney: orderResponse.data.order.net_amount_due_money,
    });

    // Send the Square API response, saved order, and payment response to the client
    res.json({
      order: orderResponse.data,
      payment: paymentResponse.data,
      savedOrder,
    });
  } catch (error) {
    console.error(
      "Error creating order and processing payment:",
      error.message
    );
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
  getOrderHistory,
  createOrderForInHouse,
};
