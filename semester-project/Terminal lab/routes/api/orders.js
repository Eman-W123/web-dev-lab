const express = require('express');
const router = express.Router();
const verifyToken = require('../../middleware/verifyToken');

// ========================
// POST /api/v1/orders
// PROTECTED - Token required
// ========================
router.post('/', verifyToken, async function(req, res) {
    try {
        const { products, totalAmount } = req.body;

        // Validation
        if (!products || products.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No products in order'
            });
        }

        // For now we just confirm the order
        // In future you can save to Orders collection
        res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            order: {
                user_id: req.user.user_id,
                products: products,
                totalAmount: totalAmount,
                status: 'pending',
                createdAt: new Date()
            }
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
