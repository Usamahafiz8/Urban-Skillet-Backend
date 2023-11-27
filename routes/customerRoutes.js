const express = require('express');
const router = express.Router();
const customerController = require('../controlers/customerControler'); // Corrected typo in the import statement

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: Customer-related operations
 */

/**
 * @swagger
 * /customers/create:
 *   post:
 *     summary: Create a new customer
 *     tags: [Customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             given_name: John
 *             family_name: Doe
 *             company_name: Example Corp
 *             email_address: john.doe@example.com
 *             phone_number: +1234567890
 *             password: securepassword
 *     responses:
 *       '201':
 *         description: Customer created successfully
 *         content:
 *           application/json:
 *             example:
 *               squareId: '123456' 
 *               createdAt: '2023-11-27T06:26:54.445Z'
 *               updatedAt: '2023-11-27T06:26:54Z'
 *               givenName: John
 *               familyName: Doe
 *               companyName: Example Corp
 *               emailAddress: john.doe@example.com
 *               phoneNumber: +1234567890
 *               password: securepassword // Include the password in the response if needed
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: Internal Server Error
 */

/**
 * @swagger
 * /customers/login:
 *   post:
 *     summary: Customer login
 *     tags: [Customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             identifier: john.doe@example.com
 *             password: securepassword
 *     responses:
 *       '200':
 *         description: Customer login successful
 *         content:
 *           application/json:
 *             example:
 *               id: '123456'
 *               createdAt: '2023-11-27T06:26:54.445Z'
 *               updatedAt: '2023-11-27T06:26:54Z'
 *               givenName: John
 *               familyName: Doe
 *               emailAddress: john.doe@example.com
 *               phoneNumber: +1234567890
 *               companyName: Example Corp
 *       '401':
 *         description: Unauthorized (Invalid email or password)
 *         content:
 *           application/json:
 *             example:
 *               error: Invalid email or password
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: Internal Server Error
 */


module.exports = router;
router.post('/create', customerController.createCustomer);
router.post('/login', customerController.customerLogin);

module.exports = router;
