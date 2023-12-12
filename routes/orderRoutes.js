/**
 * @swagger
 * /orders/create:
 *   post:
 *     // ... (existing documentation)
 * /orders/history/{customerId}:
 *   get:
 *     summary: Get order history for a specific customer
 *     parameters:
 *       - in: path
 *         name: customerId
 *         schema:
 *           type: string
 *         required: true
 *         description: Customer ID to fetch order history
 *     responses:
 *       200:
 *         description: Successful retrieval of order history
 *       500:
 *         description: Internal server error
 *
 * @swagger
 * /orders/create:
 *   post:
 *     summary: Create a new order and process payment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             order:
 *               reference_id: 'my-order-001'
 *               location_id: '057P5VYJ4A5X1'
 *               line_items:
 *                 - name: 'New York Strip Steak'
 *                   quantity: '1'
 *                   base_price_money:
 *                     amount: 1599
 *                     currency: 'USD'
 *                 - quantity: '2'
 *                   catalog_object_id: 'BEMYCSMIJL46OCDV4KYIKXIB'
 *                   modifiers:
 *                     - catalog_object_id: 'CHQX7Y4KY6N5KINJKZCFURPZ'
 *                   applied_discounts:
 *                     - discount_uid: 'one-dollar-off'
 *               taxes:
 *                 - uid: 'state-sales-tax'
 *                   name: 'State Sales Tax'
 *                   percentage: '9'
 *                   scope: 'ORDER'
 *               discounts:
 *                 - uid: 'labor-day-sale'
 *                   name: 'Labor Day Sale'
 *                   percentage: '5'
 *                   scope: 'ORDER'
 *                 - uid: 'membership-discount'
 *                   catalog_object_id: 'DB7L55ZH2BGWI4H23ULIWOQ7'
 *                   scope: 'ORDER'
 *                 - uid: 'one-dollar-off'
 *                   name: 'Sale - $1.00 off'
 *                   amount_money:
 *                     amount: 100
 *                     currency: 'USD'
 *                   scope: 'LINE_ITEM'
 *             sourceID: 'your-source-id'
 *             amount: 2000
 *     responses:
 *       200:
 *         description: Successful order creation and payment processing
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 * @swagger
 * /orders/history/{customerId}:
 *   get:
 *     summary: Get order history for a specific customer
 *     parameters:
 *       - in: path
 *         name: customerId
 *         schema:
 *           type: string
 *         required: true
 *         description: Customer ID to fetch order history
 *     responses:
 *       200:
 *         description: Successful retrieval of order history
 *       500:
 *         description: Internal server error
 * /orders/createForInHouse:
 *   post:
 *     summary: Create a new in-house order and process payment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             order:
 *               reference_id: 'my-order-001'
 *               location_id: '057P5VYJ4A5X1'
 *               line_items:
 *                 - name: 'New York Strip Steak'
 *                   quantity: '1'
 *                   base_price_money:
 *                     amount: 1599
 *                     currency: 'USD'
 *                 - quantity: '2'
 *                   catalog_object_id: 'BEMYCSMIJL46OCDV4KYIKXIB'
 *                   modifiers:
 *                     - catalog_object_id: 'CHQX7Y4KY6N5KINJKZCFURPZ'
 *                   applied_discounts:
 *                     - discount_uid: 'one-dollar-off'
 *               taxes:
 *                 - uid: 'state-sales-tax'
 *                   name: 'State Sales Tax'
 *                   percentage: '9'
 *                   scope: 'ORDER'
 *               discounts:
 *                 - uid: 'labor-day-sale'
 *                   name: 'Labor Day Sale'
 *                   percentage: '5'
 *                   scope: 'ORDER'
 *                 - uid: 'membership-discount'
 *                   catalog_object_id: 'DB7L55ZH2BGWI4H23ULIWOQ7'
 *                   scope: 'ORDER'
 *                 - uid: 'one-dollar-off'
 *                   name: 'Sale - $1.00 off'
 *                   amount_money:
 *                     amount: 100
 *                     currency: 'USD'
 *             sourceID: 'your-source-id'
 *             amount: 2000
 *     responses:
 *       200:
 *         description: Successful in-house order creation and payment processing
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

const express = require("express");
const router = express.Router();
const ordersController = require("../controlers/orderControler");

router.post("/create", ordersController.createOrderAndProcessPayment);
router.get("/history/:customerId", ordersController.getOrderHistory);
router.post("/createForInHouse", ordersController.createOrderForInHouse);

module.exports = router;
