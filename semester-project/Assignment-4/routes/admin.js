const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');

// ========================
// MULTER SETUP
// ========================
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// ========================
// DASHBOARD - GET /admin
// ========================
router.get('/', async function(req, res) {
    try {
        const products = await Product.find();
        const totalProducts = products.length;
        const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
        const categories = await Product.distinct('category');

        res.render('admin/dashboard', {
            products,
            totalProducts,
            totalStock,
            categories
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// ========================
// ADD PRODUCT - GET /admin/add
// ========================
router.get('/add', function(req, res) {
    res.render('admin/add');
});

// ADD PRODUCT - POST /admin/add
router.post('/add', upload.single('image'), async function(req, res) {
    try {
        const { name, price, category, rating, stock } = req.body;
        const image = req.file ? '/uploads/' + req.file.filename : '';

        const newProduct = new Product({
            name,
            price: parseFloat(price),
            category,
            rating: parseFloat(rating),
            stock: parseInt(stock),
            image
        });

        await newProduct.save();
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// ========================
// EDIT PRODUCT - GET /admin/edit/:id
// ========================
router.get('/edit/:id', async function(req, res) {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).send('Product not found');
        res.render('admin/edit', { product });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// EDIT PRODUCT - POST /admin/edit/:id
router.post('/edit/:id', upload.single('image'), async function(req, res) {
    try {
        const { name, price, category, rating, stock } = req.body;
        const updateData = {
            name,
            price: parseFloat(price),
            category,
            rating: parseFloat(rating),
            stock: parseInt(stock)
        };

        if (req.file) {
            updateData.image = '/uploads/' + req.file.filename;
        }

        await Product.findByIdAndUpdate(req.params.id, updateData);
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// ========================
// DELETE PRODUCT - POST /admin/delete/:id
// ========================
router.post('/delete/:id', async function(req, res) {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router;
