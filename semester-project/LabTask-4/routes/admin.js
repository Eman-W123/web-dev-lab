const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { isAdmin } = require('../middleware/auth');

// ========================
// MULTER SETUP
// ========================
const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

async function removeUploadIfExists(imagePath) {
    if (!imagePath || typeof imagePath !== 'string') return;
    if (!imagePath.startsWith('/uploads/')) return;

    const fileName = imagePath.replace('/uploads/', '');
    if (!fileName) return;

    const fullPath = path.join(uploadsDir, fileName);
    try {
        await fs.promises.stat(fullPath);
        await fs.promises.unlink(fullPath);
    } catch (err) {
        if (err.code !== 'ENOENT') {
            console.warn('Failed to remove upload:', err);
        }
    }
}

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadsDir);
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
        const products = await Product.find().sort({ name: 1 });
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
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).send('Product not found');

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

        if (req.file) {
            await removeUploadIfExists(product.image);
        }
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
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).send('Product not found');

        await Product.findByIdAndDelete(req.params.id);
        await removeUploadIfExists(product.image);
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router;
