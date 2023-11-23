// paymentRoutes.js

const express = require('express');
const paymentController = require('../controlers/paymentControler'); // Update the path accordingly

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment-related operations
 */

/**
 * @swagger
 * /payments/process-payment:
 *   post:
 *     summary: Process a payment
 *     tags: [Payments]
 *     requestBody:
 *       description: Payment details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderID:
 *                 type: string
 *               sourceID:
 *                 type: string
 *               amount:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Successful payment processing
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post('/process-payment', paymentController.processPayment);

module.exports = router;
