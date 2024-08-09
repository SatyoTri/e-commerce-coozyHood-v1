const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const Product = require('../models/product');

// Middleware to ensure authentication
router.use(authMiddleware);

// Add item to cart
router.post('/add-to-cart/:productId', async (req, res) => {
    const { productId } = req.params;
    const { quantity,size } = req.body;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const user = req.user;

        // Check product already exists in the cart
        const existingCartItem = user.cart.find(item => item.product.toString() === productId);
        if (existingCartItem) {
            existingCartItem.quantity += parseInt(quantity);
        } else {
            user.cart.push({ product: productId, quantity,size });
        }

        await user.save();

        res.status(200).json({ message: 'Product added to cart successfully', cart: user.cart });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add product to cart' });
    }
});

// Get cart items
router.get('/cart', async (req, res) => {
    try {
        const user = req.user;
        
        // Fetch products manually
        const cartItems = await Promise.all(user.cart.map(async (item) => {
            const product = await Product.findById(item.product);
            return {
                product,
                quantity: item.quantity,
                size: item.size
            };
        }));

        res.status(200).json(cartItems);
    } catch (error) {
        console.error('Error retrieving cart items:', error);
        res.status(500).json({ error: 'Failed to retrieve cart items' });
    }
});

// Update item quantity in cart
router.put('/update-cart/:productId', async (req, res) => {
    const { productId } = req.params;
    const { quantity } = req.body;

    try {
        const user = req.user;
        const cartItem = user.cart.find(item => item.product.toString() === productId);

        if (!cartItem) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        cartItem.quantity = quantity;
        await user.save();

        res.status(200).json({ message: 'Cart updated successfully', cart: user.cart });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update cart' });
    }
});

// Remove item from cart
router.delete('/remove-from-cart/:productId', async (req, res) => {
    const { productId } = req.params;

    try {
        const user = req.user;
        user.cart = user.cart.filter(item => item.product.toString() !== productId);
        await user.save();

        res.status(200).json({ message: 'Product removed from cart successfully', cart: user.cart });
    } catch (error) {
        res.status(500).json({ error: 'Failed to remove product from cart' });
    }
});

module.exports = router;
