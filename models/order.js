const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderItemSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    size:{
        type: String,
        required: true
    },
     title: { 
        type: String,
        required: true
    }
});
const checkoutSchema = new mongoose.Schema({
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    },
    recipientName: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    whatsappNumber: {
        type: String,
        required: true
    },
    proofOfTransfer: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    items: [orderItemSchema],
});

module.exports = mongoose.model('Checkout', checkoutSchema);
