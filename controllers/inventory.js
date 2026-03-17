let inventoryModel = require('../schemas/inventories');

// Get all inventories
exports.getAll = async (req, res, next) => {
    try {
        let result = await inventoryModel.find().populate({
            path: 'product',
            select: 'title price category'
        });
        res.send(result);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Get inventory by ID with product details
exports.getById = async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await inventoryModel.findById(id).populate({
            path: 'product',
            select: 'title price description category images'
        });
        if (result) {
            res.send(result);
        } else {
            res.status(404).send({ message: "Inventory not found" });
        }
    } catch (error) {
        res.status(404).send({ message: error.message });
    }
};

// Add stock
exports.addStock = async (req, res, next) => {
    try {
        let { product, quantity } = req.body;
        
        if (!product || !quantity) {
            return res.status(400).send({ message: "Product and quantity are required" });
        }
        
        if (quantity < 0) {
            return res.status(400).send({ message: "Quantity must be greater than 0" });
        }
        
        let inventory = await inventoryModel.findOneAndUpdate(
            { product: product },
            { $inc: { stock: quantity } },
            { new: true }
        ).populate({
            path: 'product',
            select: 'title price'
        });
        
        if (!inventory) {
            return res.status(404).send({ message: "Inventory not found for this product" });
        }
        
        res.send({
            message: `Added ${quantity} item(s) to stock`,
            inventory: inventory
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Remove stock
exports.removeStock = async (req, res, next) => {
    try {
        let { product, quantity } = req.body;
        
        if (!product || !quantity) {
            return res.status(400).send({ message: "Product and quantity are required" });
        }
        
        if (quantity < 0) {
            return res.status(400).send({ message: "Quantity must be greater than 0" });
        }
        
        // Check if enough stock available
        let inventory = await inventoryModel.findOne({ product: product });
        
        if (!inventory) {
            return res.status(404).send({ message: "Inventory not found for this product" });
        }
        
        if (inventory.stock < quantity) {
            return res.status(400).send({ 
                message: `Insufficient stock. Available: ${inventory.stock}, Requested: ${quantity}` 
            });
        }
        
        let updated = await inventoryModel.findOneAndUpdate(
            { product: product },
            { $inc: { stock: -quantity } },
            { new: true }
        ).populate({
            path: 'product',
            select: 'title price'
        });
        
        res.send({
            message: `Removed ${quantity} item(s) from stock`,
            inventory: updated
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Make reservation (decrease stock, increase reserved)
exports.reservation = async (req, res, next) => {
    try {
        let { product, quantity } = req.body;
        
        if (!product || !quantity) {
            return res.status(400).send({ message: "Product and quantity are required" });
        }
        
        if (quantity < 0) {
            return res.status(400).send({ message: "Quantity must be greater than 0" });
        }
        
        // Check if enough stock available
        let inventory = await inventoryModel.findOne({ product: product });
        
        if (!inventory) {
            return res.status(404).send({ message: "Inventory not found for this product" });
        }
        
        if (inventory.stock < quantity) {
            return res.status(400).send({ 
                message: `Insufficient stock for reservation. Available: ${inventory.stock}, Requested: ${quantity}` 
            });
        }
        
        let updated = await inventoryModel.findOneAndUpdate(
            { product: product },
            { 
                $inc: { 
                    stock: -quantity,
                    reserved: quantity
                } 
            },
            { new: true }
        ).populate({
            path: 'product',
            select: 'title price'
        });
        
        res.send({
            message: `Reserved ${quantity} item(s)`,
            inventory: updated
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Mark as sold (decrease reserved, increase soldCount)
exports.sold = async (req, res, next) => {
    try {
        let { product, quantity } = req.body;
        
        if (!product || !quantity) {
            return res.status(400).send({ message: "Product and quantity are required" });
        }
        
        if (quantity < 0) {
            return res.status(400).send({ message: "Quantity must be greater than 0" });
        }
        
        // Check if enough reserved items
        let inventory = await inventoryModel.findOne({ product: product });
        
        if (!inventory) {
            return res.status(404).send({ message: "Inventory not found for this product" });
        }
        
        if (inventory.reserved < quantity) {
            return res.status(400).send({ 
                message: `Insufficient reserved items. Available: ${inventory.reserved}, Requested: ${quantity}` 
            });
        }
        
        let updated = await inventoryModel.findOneAndUpdate(
            { product: product },
            { 
                $inc: { 
                    reserved: -quantity,
                    soldCount: quantity
                } 
            },
            { new: true }
        ).populate({
            path: 'product',
            select: 'title price'
        });
        
        res.send({
            message: `Marked ${quantity} item(s) as sold`,
            inventory: updated
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
