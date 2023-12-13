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
    if (!req.body) {
      return res.status(400).json({ error: "Request body is missing" });
    }

    const { order, sourceID, amount, location_id } = req.body;

    if (!order || !order.location_id) {
      return res.status(400).json({ error: "Invalid order data" });
    }

    let customerSquareId;

    // Check if customer_id is provided in the order
    if (order.customer_id) {
      // If customer_id is provided, use it directly
      customerSquareId = order.customer_id;
    } else {
      // Check if recipient information is available in the order
      const { recipient } = order;

      if (!recipient) {
        return res.status(400).json({
          error: "Recipient information is missing in the order",
        });
      }

      // Check if a customer with the provided email or phone number already exists in the database
      const existingCustomer = await Customer.findOne({
        $or: [
          { emailAddress: recipient.email_address },
          { phoneNumber: recipient.phone_number },
        ],
      });

      if (existingCustomer) {
        // If customer exists in the database, use the existing customerSquareId
        customerSquareId = existingCustomer.customerSquareId;
      } else {
        // Customer doesn't exist in the database, check in Square
        const { given_name, family_name, email_address, phone_number } =
          recipient;

        // Check if customer exists in Square
        const squareCustomerResponse = await SquareBaseURL.post(
          "/customers/search",
          {
            query: {
              filter: {
                email_address: email_address,
                phone_number: phone_number,
              },
            },
          }
        );

        if (
          squareCustomerResponse.data.customers &&
          squareCustomerResponse.data.customers.length > 0
        ) {
          // Customer exists in Square, use the Square customer
          const squareCustomer = squareCustomerResponse.data.customers[0];
          customerSquareId = squareCustomer.id;

          // Save the customer information into the database
          const newCustomer = await Customer.create({
            customerSquareId: squareCustomer.id,
            given_name,
            family_name,
            emailAddress: email_address,
            phoneNumber: phone_number,
          });

          customerSquareId = newCustomer.customerSquareId;
        } else {
          // Customer doesn't exist in Square, create a new customer in Square
          const idempotency_key_customer = uuidv4();

          const createCustomerResponse = await SquareBaseURL.post(
            "/customers",
            {
              idempotency_key: idempotency_key_customer,
              given_name,
              family_name,
              email_address,
              phone_number,
            }
          );

          // Save the customer information into the database
          const newCustomer = await Customer.create({
            customerSquareId: createCustomerResponse.data.customer.id,
            given_name,
            family_name,
            emailAddress: email_address,
            phoneNumber: phone_number,
          });

          customerSquareId = newCustomer.customerSquareId;
        }
      }
    }

    const idempotency_key_order = uuidv4();

    // Update order with customerSquareId
    order.customer_id = customerSquareId;

    // Create order
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
