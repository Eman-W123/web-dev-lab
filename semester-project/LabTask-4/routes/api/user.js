const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const verifyToken = require('../../middleware/verifyToken');

// ========================
// GET /api/v1/user/profile
// PROTECTED - Token required
// ========================
router.get('/profile', verifyToken, async function(req, res) {
    try {
        // req.user contains decoded token data
        const user = await User.findById(req.user.user_id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            user: user
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
