const express = require('express');
const router = express.Router();
const locationsController = require('../contrllers/locationControler');

// Define location routes
router.get('/list', locationsController.listLocations);

module.exports = router;
