// models/cart.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartItemSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1  // Minimum quantity should be 1
  }
});

const cartSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true  // Ensure each user has only one cart
  },
  items: [cartItemSchema]
});

module.exports = mongoose.model('Cart', cartSchema);
