const express = require('express');
const multer = require('multer');
const router = express.Router();
const Product = require('../models/product');


// Set up multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

// Create a new product with an image
router.post('/', upload.single('image'), async (req, res) => {
    const { title, price, description, category,sizes } = req.body;
    const image = req.file ? req.file.filename : null;
    const product = new Product({ title, price, description, image, category,sizes });

    try {
        await product.save();
        res.status(201).send(product);
    } catch (error) {
        res.status(400).send(error);
    }
});


// Get a product by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).send({ message: 'Product not found' });
        }
        res.status(200).send(product);
    } catch (error) {
        res.status(500).send(error);
    }
});


// Get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).send(products);
    } catch (error) {
        res.status(500).send(error);
    }
});


// Update a product by ID
router.put('/:id', upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    if (req.file) {
        updates.image = req.file.filename;
    }

    try {
        const product = await Product.findByIdAndUpdate(id, updates, { new: true });
        if (!product) {
            return res.status(404).send({ message: 'Product not found' });
        }
        res.status(200).send(product);
    } catch (error) {
        res.status(400).send(error);
    }
});


// Delete a product by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).send({ message: 'Product not found' });
        }
        res.status(200).send({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).send(error);
    }
});
router.get('/categories', async (req, res) => {
    try {
        const categories = await Product.distinct('category');
        res.status(200).send(categories);
    } catch (error) {
        res.status(500).send("errrror");
    }
});
// Get products in a specific category
router.get('/category/:category', async (req, res) => {
    const category = req.params.category;
    const limit = Number(req.query.limit) || 0;
    const sort = req.query.sort === 'desc' ? -1 : 1;

    try {
        const products = await Product.find({ category })
            .select('-_id')
            .limit(limit)
            .sort({ id: sort });

        res.json(products);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to retrieve products' });
    }
});

module.exports = router;
