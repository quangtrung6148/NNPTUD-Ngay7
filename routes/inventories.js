var express = require('express');
var router = express.Router();
let inventoryController = require('../controllers/inventory');

// Get all inventories
router.get('/', inventoryController.getAll);

// Get inventory by ID
router.get('/:id', inventoryController.getById);

// Add stock
router.post('/add-stock', inventoryController.addStock);

// Remove stock
router.post('/remove-stock', inventoryController.removeStock);

// Make reservation
router.post('/reservation', inventoryController.reservation);

// Mark as sold
router.post('/sold', inventoryController.sold);

module.exports = router;
