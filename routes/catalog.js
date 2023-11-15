/**
 * @swagger
 * /catalog/alllocation:
 *   get:
 *     summary: Get a list of all catalogs
 *     responses:
 *       '200':
 *         description: A successful response
 *         content:
 *           application/json:
 *             example:
 *               - id: '1'
 *                 name: 'Catalog 1'
 *               - id: '2'
 *                 name: 'Catalog 2'
 * 
 * @swagger
 * /catalog/location/{locationId}:
 *   get:
 *     summary: Get catalogs filtered by location
 *     parameters:
 *       - in: path
 *         name: locationId
 *         required: true
 *         description: ID of the location to filter catalogs
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: A successful response
 *         content:
 *           application/json:
 *             example:
 *               - id: '1'
 *                 name: 'Catalog 1'
 * 
 * @swagger
 * /catalog/item/{itemId}:
 *   get:
 *     summary: Get details of a catalog item
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         description: ID of the item to retrieve details
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: A successful response
 *         content:
 *           application/json:
 *             example:
 *               id: '1'
 *               name: 'Catalog Item 1'
 */
const express = require('express');
const router = express.Router();
const CatalogController = require('../contrllers/catalogcontroler');

// Define location routes
router.get('/alllocation', CatalogController.listallCatalogs);
router.get('/location/:locationId', CatalogController.filterCatalogsByLocation);
router.get('/item/:itemId', CatalogController.filterCatalogsByLocation);

module.exports = router;
