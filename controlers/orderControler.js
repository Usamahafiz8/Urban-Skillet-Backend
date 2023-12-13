const SquareBaseURL = require("../apiConstrains/apiList");
const { v4: uuidv4 } = require("uuid");
const Order = require("../models/ordersSchema");
const Customer = require("../models/customerSchema");

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

    // Add customerId to the order object
    orderResponse.data.order.customer_id = savedOrder.customerId;

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

// Helper function to create or update a customer in Square
const createOrUpdateCustomer = async ({
  givenName, // Include the givenName field
  email_address,
  phone_number,
}) => {
  const idempotency_key_customer = uuidv4();

  const createCustomerResponse = await SquareBaseURL.post("/customers", {
    idempotency_key: idempotency_key_customer,
    givenName: givenName,
    email_address,
    phone_number,
  });

  return createCustomerResponse.data.customer;
};

// Helper function to check if a customer exists in the database
const findCustomerInDatabase = async ({ email_address, phone_number }) => {
  return await Customer.findOne({
    $or: [{ emailAddress: email_address }, { phoneNumber: phone_number }],
  });
};

// Helper function to create a new customer in the database
const createCustomerInDatabase = async ({
  customerSquareId,
  givenName,
  email_address,
  phone_number,
}) => {
  return await Customer.create({
    customerSquareId,
    givenName,
    emailAddress: email_address,
    phoneNumber: phone_number,
  });
};

// Helper function to retrieve customer information from Square

const findCustomerInSquare = async ({ email_address, phone_number }) => {
  const squareCustomerResponse = await SquareBaseURL.post("/customers/search", {
    query: {
      filter: {
        email_address: {
          exact: email_address,
        },
        phone_number: {
          exact: phone_number,
        },
      },
    },
  });

  return squareCustomerResponse.data.customers &&
    squareCustomerResponse.data.customers.length > 0
    ? squareCustomerResponse.data.customers[0]
    : null;
};

const createOrderForInHouse = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ error: "Request body is missing" });
    }
    // console.log("Request Body:", req.body);
    console.dir(req.body, { depth: null });

    const {
      order,
      sourceID,
      amount,
      location_id,
      givenName,
      email_address,
      phone_number,
    } = req.body;

    if (!order || !order.location_id) {
      return res.status(400).json({ error: "Invalid order data" });
    }

    // Check if customer_id is missing in the order
    if (!order.customer_id) {
      if (!(givenName && email_address && phone_number)) {
        return res.status(400).json({
          error: "Customer details are missing in the order",
        });
      }

      let customerSquareId;
      // Check if the customer exists in the database
      const existingCustomer = await findCustomerInDatabase({
        email_address,
        phone_number,
      });

      if (existingCustomer) {
        customerSquareId = existingCustomer.customerSquareId;
      } else {
        // Check if the customer exists in Square
        const squareCustomer = await findCustomerInSquare({
          email_address,
          phone_number,
        });

        if (squareCustomer) {
          customerSquareId = squareCustomer.id;

          // Save the customer information into the database
          await createCustomerInDatabase({
            customerSquareId,
            givenName,
            email_address,
            phone_number,
          });
        } else {
          // Create a new customer in Square
          const newSquareCustomer = await createOrUpdateCustomer({
            givenName,
            email_address,
            phone_number,
          });

          customerSquareId = newSquareCustomer.id;

          // Save the customer information into the database
          await createCustomerInDatabase({
            customerSquareId,
            givenName,
            email_address,
            phone_number,
          });
        }
      }

      // Add customer_id to the order object
      order.customer_id = customerSquareId;
    }

    const idempotency_key_order = uuidv4();

    const orderResponse = await SquareBaseURL.post("/orders", {
      idempotency_key: idempotency_key_order,
      order,
    });

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

    // Add customerId to the order object
    orderResponse.data.order.customer_id = savedOrder.customerId;

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
