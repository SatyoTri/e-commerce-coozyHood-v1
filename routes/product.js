const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const upload = require('../middleware/multer');
const cloudinary = require('cloudinary').v2; 


// Create a new product with an image
router.post('/', upload.single('image'), async (req, res) => {
    const { title, price, description, category, sizes } = req.body;

    try {
        const image = await cloudinary.uploader.upload(req.file.path);
        const product = new Product({ 
            title, 
            price, 
            description, 
            image: image.secure_url, 
            category, 
            sizes 
        });

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
        const image = await cloudinary.uploader.upload(req.file.path);
        updates.image = image.secure_url;
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
