const express = require('express');
const router = express.Router();
const Product = require('../../models/Product');
const verifyToken = require('../../middleware/verifyToken');

// ========================
// GET /api/v1/products
// PUBLIC - No token needed
// ========================
router.get('/', async function(req, res) {
    try {
        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 8;
        const skip = (page - 1) * limit;

        // Filtering
        const search = req.query.search || '';
        const category = req.query.category || '';
        const minPrice = req.query.minPrice || '';
        const maxPrice = req.query.maxPrice || '';

        // Build filter object
        const filter = {};
        if (search) filter.name = { $regex: search, $options: 'i' };
        if (category) filter.category = category;
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = parseInt(minPrice);
            if (maxPrice) filter.price.$lte = parseInt(maxPrice);
        }

        // Get total count
        const totalProducts = await Product.countDocuments(filter);
        const totalPages = Math.ceil(totalProducts / limit);

        // Get products
        const products = await Product.find(filter)
            .skip(skip)
            .limit(limit)
            .lean();

        // Send JSON response
        res.status(200).json({
            success: true,
            currentPage: page,
            totalPages: totalPages,
            totalProducts: totalProducts,
            products: products
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// ========================
// GET /api/v1/products/:id
// PUBLIC - No token needed
// ========================
router.get('/:id', async function(req, res) {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            product: product
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;
