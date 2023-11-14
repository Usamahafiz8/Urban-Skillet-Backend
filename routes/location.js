/**
 * @swagger
 * /locations/list:
 *   get:
 *     summary: Get a list of Square locations
 *     responses:
 *       '200':
 *         description: A successful response
 *         content:
 *           application/json:
 *             example:
 *               message: Locations retrieved successfully
 */
const express = require('express');
const squareController = require('../contrllers/locationControler');
const squareMiddleware = require('../middleware/squareMiddleware');

const router = express.Router();

// Apply the middleware to all routes in this router
router.use(squareMiddleware);


router.get('/list', squareController.listLocations);

module.exports = router;
