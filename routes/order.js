const express = require('express');
const multer = require('multer');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const Checkout = require('../models/order');
const User = require('../models/user'); 
const Product = require('../models/product');
const History = require('../models/History');

// Middleware to ensure authentication for POST /checkout route
router.use('/checkout', authMiddleware);
router.use('/orders', authMiddleware);

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + (file.originalname)); // Append extension
    }
});

const upload = multer({ storage: storage });

// Checkout route
router.post('/checkout', upload.single('proofOfTransfer'), async (req, res) => {
    const { recipientName, address, whatsappNumber } = req.body;
    const proofOfTransfer = req.file ? req.file.filename : null;

    if (!recipientName || !address || !whatsappNumber) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const user = req.user; // user retrieved from authMiddleware
        const cart = user.cart;

        // Mendapatkan detail produk dari cart pengguna
        const items = await Promise.all(cart.map(async (cartItem) => {
            const product = await Product.findById(cartItem.product).select('title'); // Mengambil judul produk
            return {
                product: cartItem.product,
                quantity: cartItem.quantity,
                size: cartItem.size,
                title: product.title 
            };
        }));

        // Save proof of transfer path to a new Checkout document
        const checkout = new Checkout({
            user: user._id,
            recipientName,
            address,
            whatsappNumber,
            proofOfTransfer,
            items
        });

        await checkout.save();

        user.cart = [];
        await user.save();

        res.status(200).json({ message: 'Checkout successful', checkout });
    } catch (error) {
        console.error('Error during checkout:', error);
        res.status(500).json({ error: 'Checkout failed' });
    }
});

// Get all checkouts (no authentication required)
router.get('/checkouts', async (req, res) => {
    try {
        const checkouts = await Checkout.find({});

        res.status(200).json({ checkouts });
    } catch (error) {
        console.error('Error fetching checkouts:', error);
        res.status(500).json({ error: 'Failed to fetch checkouts' });
    }
});

router.get('/orders', async (req, res) => {
    try {
        const user = req.user; // user retrieved from authMiddleware
        const orders = await Checkout.find({ user: user._id });

        res.status(200).json({ orders });
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ error: 'Failed to fetch user orders' });
    }
});

router.patch('/complete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const checkout = await Checkout.findById(id);
        if (!checkout) {
            return res.status(404).json({ error: 'Checkout not found' });
        }

        const history = new History({
            user: checkout.user,
            recipientName: checkout.recipientName,
            address: checkout.address,
            whatsappNumber: checkout.whatsappNumber,
            proofOfTransfer: checkout.proofOfTransfer,
            items: checkout.items,
            status: 'Completed',
            shippingStatus: checkout.shippingStatus // Preserve the shipping status
        });

        await history.save();
        await Checkout.findByIdAndDelete(id);

        res.status(200).json({ message: 'Checkout marked as completed and moved to history', history });
    } catch (error) {
        console.error('Error updating checkout status:', error);
        res.status(500).json({ error: 'Failed to update checkout status' });
    }
});

// Update shipping status
router.patch('/shipping-status/:id', async (req, res) => {
    const { id } = req.params;
    const { shippingStatus } = req.body;

    try {
        const checkout = await Checkout.findById(id);
        if (!checkout) {
            return res.status(404).json({ error: 'Checkout not found' });
        }

        checkout.shippingStatus = shippingStatus;
        await checkout.save();

        res.status(200).json({ message: 'Shipping status updated', checkout });
    } catch (error) {
        console.error('Error updating shipping status:', error);
        res.status(500).json({ error: 'Failed to update shipping status' });
    }
});

// Get all history orders (no authentication required)
router.get('/history', async (req, res) => {
    try {
        const historyOrders = await History.find({});

        res.status(200).json({ historyOrders });
    } catch (error) {
        console.error('Error fetching history orders:', error);
        res.status(500).json({ error: 'Failed to fetch history orders' });
    }
});

module.exports = router;
