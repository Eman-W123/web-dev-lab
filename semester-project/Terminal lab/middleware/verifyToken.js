const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    // Get token from Authorization header
    // Header format: Authorization: Bearer <token>
    const authHeader = req.headers['authorization'];

    // Check if header exists
    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: 'Access denied. No token provided.'
        });
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.split(' ')[1];

    // Check if token exists after splitting
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access denied. Invalid token format.'
        });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach decoded user info to request
        req.user = decoded;

        // Move to next middleware
        next();

    } catch (err) {
        // Token is invalid or expired
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token has expired. Please login again.'
            });
        }
        return res.status(403).json({
            success: false,
            message: 'Invalid token.'
        });
    }
}

module.exports = verifyToken;
