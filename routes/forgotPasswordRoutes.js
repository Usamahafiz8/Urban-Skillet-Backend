const express = require('express');
const router = express.Router();
const forgotPasswordController = require('../controlers/forgotPasswordControler');

/**
 * @swagger
 * tags:
 *   name: ForgotPassword
 *   description: Forgot password-related operations
 */

/**
 * @swagger
 * /forgotpassword/initiate:
 *   post:
 *     summary: Initiate the forgot password process
 *     tags: [ForgotPassword]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             email_address: john.doe@example.com
 *     responses:
 *       '200':
 *         description: Verification email sent successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Verification email sent. Check your email for the code.
 *       '404':
 *         description: Customer not found
 *         content:
 *           application/json:
 *             example:
 *               error: Customer not found
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: Internal Server Error
 */

/**
 * @swagger
 * /forgotpassword/complete:
 *   post:
 *     summary: Complete the forgot password process
 *     tags: [ForgotPassword]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             email_address: john.doe@example.com
 *             verificationCode: 123456
 *             new_password: newSecurePassword
 *     responses:
 *       '200':
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Password updated successfully.
 *       '404':
 *         description: Customer not found
 *         content:
 *           application/json:
 *             example:
 *               error: Customer not found
 *       '400':
 *         description: Invalid verification code
 *         content:
 *           application/json:
 *             example:
 *               error: Invalid verification code
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: Internal Server Error
 */
/**
 * @swagger
 * /forgotpassword/varifyotp:
 *   post:
 *     summary: Complete the forgot password process
 *     tags: [ForgotPassword]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             email_address: john.doe@example.com
 *             verificationCode: 123456
 *         
 *     responses:
 *       '200':
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Password updated successfully.
 *       '404':
 *         description: Customer not found
 *         content:
 *           application/json:
 *             example:
 *               error: Customer not found
 *       '400':
 *         description: Invalid verification code
 *         content:
 *           application/json:
 *             example:
 *               error: Invalid verification code
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: Internal Server Error
 */

router.post('/initiate', forgotPasswordController.forgotPasswordInitiate);
router.post('/varifyotp', forgotPasswordController.VarifyOTP);
router.post('/complete', forgotPasswordController.forgotPasswordComplete);

module.exports = router;
