/**
 * @swagger
 * /items/Popular/{locationId}:
 *   get:
 *     summary: Get the first item of each category for a given location
 *     parameters:
 *       - in: path
 *         name: locationId
 *         required: true
 *         description: ID of the location to filter items
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: A successful response
 *         content:
 *           application/json:
 *             example:
 *               - categoryId: 'TCSSX34YZ7DTVMPSOSEI6PTS'
 *                 categoryName: 'Wings'
 *                 item:
 *                   itemId: 'T2BL4DTZCTUVUD4BCIXND46U'
 *                   itemName: 'Burgar1'
 *  @swagger
 * /items/Detail/{itemId}:
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
 *  @swagger
 * /items/modifier/{modifierID}:
 *   get:
 *     summary: Get details of a catalog item
 *     parameters:
 *       - in: path
 *         name: modifierID
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
 * @swagger
 * /items/tax/{taxID}/{locationID}:
 *   get:
 *     summary: Get details of a tax for a specific location
 *     parameters:
 *       - in: path
 *         name: taxID
 *         required: true
 *         description: ID of the tax to retrieve details
 *         schema:
 *           type: string
 *       - in: path
 *         name: locationID
 *         required: true
 *         description: ID of the location to filter tax
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: A successful response
 *         content:
 *           application/json:
 *             example:
 *               id: 'QLDJQJXLHN3CQH2VXEWYKAVW'
 *               name: 'North Hollywood Sales tax'
 */
const express = require('express');
const router = express.Router();
const ItemsControler = require('../controlers/ItemControler');


// Define Routes 
router.get('/Popular/:locationId', ItemsControler.PopularItems);
router.get('/Detail/:itemId', ItemsControler.ItemInformation);
router.get('/modifier/:modifierID', ItemsControler.ItemModifier);
router.get('/tax/:taxID/:locationID', ItemsControler.ItemTax);


module.exports = router;
