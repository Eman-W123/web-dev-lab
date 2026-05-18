const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const dotenv = require('dotenv');
const expressLayouts = require('express-ejs-layouts');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ========================
// VIEW ENGINE
// ========================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// ========================
// MIDDLEWARE
// ========================
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ========================
// CONNECT TO MONGODB
// ========================
mongoose.connect(process.env.MONGODB_URI)
    .then(function() {
        console.log('Connected to MongoDB!');
    })
    .catch(function(error) {
        console.log('Connection error:', error);
    });

// ========================
// SESSION SETUP
// ========================
app.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));

// ========================
// FLASH MESSAGES
// ========================
app.use(flash());

// ========================
// GLOBAL VARIABLES
// ========================
app.use(function(req, res, next) {
    res.locals.user = req.session.user || null;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    const cart = req.session.cart || [];
    res.locals.cartCount = cart.reduce(function(sum, item) { return sum + item.quantity; }, 0);
    res.locals.layout = false;
    next();
});

// ========================
// WEB ROUTES
// ========================
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const onsaleRoutes = require('./routes/onsale');
const adminRoutes = require('./routes/admin');
const { isAdmin, isLoggedIn } = require('./middleware/auth');

const cartRoutes = require('./routes/cart');
const checkoutRoutes = require('./routes/checkout');

app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/onsale-products', onsaleRoutes);
app.use('/admin', isAdmin, adminRoutes);
app.use('/cart', cartRoutes);
app.use('/checkout', checkoutRoutes);

// Order success page
app.get('/order-success', function(req, res) {
    res.render('order-success');
});

// Home route
const Product = require('./models/Product');
app.get('/', async function(req, res) {
    try {
        const products = await Product.find().select('_id name').lean();
        res.render('index', { products: products });
    } catch (err) {
        console.error(err);
        res.render('index', { products: [] });
    }
});

// Profile route (protected)
app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile');
});

// ========================
// API ROUTES
// ========================
const apiAuthRoutes = require('./routes/api/auth');
const apiProductRoutes = require('./routes/api/products');
const apiUserRoutes = require('./routes/api/user');
const apiOrderRoutes = require('./routes/api/orders');

app.use('/api/v1/auth', apiAuthRoutes);
app.use('/api/v1/products', apiProductRoutes);
app.use('/api/v1/user', apiUserRoutes);
app.use('/api/v1/orders', apiOrderRoutes);

// ========================
// ERROR HANDLER
// ========================
app.use(function(err, req, res, next) {
    console.error('Unhandled error:', err);
    const message = (process.env.NODE_ENV === 'production')
        ? 'Server error'
        : (err && err.message ? err.message : 'Server error');
    res.status(500).send(message);
});

// ========================
// START SERVER
// ========================
app.listen(PORT, function() {
    console.log(`Server running at http://localhost:${PORT}`);
});
