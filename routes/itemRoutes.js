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
 * 
 * @swagger
 * /items/Detail/{itemId}/{locationId}:
 *   get:
 *     summary: Get details of a catalog item
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         description: ID of the item to retrieve details
 *         schema:
 *           type: string
 *       - in: path
 *         name: locationId
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
 *               id: '1'
 *               name: 'Catalog Item 1'
 *               taxDetails: [
 *                 {
 *                   id: 'QLDJQJXLHN3CQH2VXEWYKAVW',
 *                   name: 'North Hollywood Sales tax',
 *                   isPresentAtLocation: false
 *                 },
 *                 // Additional tax details...
 *               ]
 * @swagger
 * /items/modifier/{modifierID}:
 *   get:
 *     summary: Get the first item of each category for a given location
 *     parameters:
 *       - in: path
 *         name: modifierID
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
 * 
 */

const express = require('express');
const router = express.Router();
const ItemsControler = require('../controlers/ItemControler');

// Define Routes 
router.get('/Popular/:locationId', ItemsControler.PopularItems);
router.get('/Detail/:itemId/:locationId', ItemsControler.ItemInformation);
router.get('/modifier/:modifierID', ItemsControler.ItemModifier);


module.exports = router;
