const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET /onsale-products
router.get('/', async function(req, res) {
    try {
        const products = await Product.find({ isOnSale: true }).lean();

        res.render('onsale', {
            layout: 'layout',
            products: products,
            totalProducts: products.length
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router;
