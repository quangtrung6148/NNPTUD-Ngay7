let mongoose = require('mongoose');

let inventorySchema = new mongoose.Schema({
    product: {
        type: mongoose.Types.ObjectId,
        ref: 'product',
        required: [true, "Product ID is required"],
        unique: [true, "Product already has an inventory"]
    },
    stock: {
        type: Number,
        default: 0,
        min: [0, "Stock cannot be less than 0"]
    },
    reserved: {
        type: Number,
        default: 0,
        min: [0, "Reserved cannot be less than 0"]
    },
    soldCount: {
        type: Number,
        default: 0,
        min: [0, "Sold count cannot be less than 0"]
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('inventory', inventorySchema);
