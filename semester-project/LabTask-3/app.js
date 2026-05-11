const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo').MongoStore;
const flash = require('connect-flash');

const app = express();
const PORT = 3000;

// ========================
// VIEW ENGINE
// ========================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ========================
// MIDDLEWARE
// ========================
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ========================
// CONNECT TO MONGODB
// ========================
mongoose.connect('mongodb://127.0.0.1:27017/rivajDB')
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
    secret: 'rivaj-secret-key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: 'mongodb://127.0.0.1:27017/rivajDB'
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24  // 24 hours
    }
}));

// ========================
// FLASH MESSAGES
// ========================
app.use(flash());

// ========================
// GLOBAL VARIABLES
// ========================
// Makes user and flash messages available in all EJS templates
app.use(function(req, res, next) {
    res.locals.user = req.session.user || null;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// ========================
// ROUTES
// ========================
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const adminRoutes = require('./routes/admin');
const { isAdmin, isLoggedIn } = require('./middleware/auth');

app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/admin', isAdmin, adminRoutes);

// Home route
app.get('/', function(req, res) {
    res.render('index');
});

// Checkout route (protected)
app.get('/checkout', isLoggedIn, function(req, res) {
    res.render('checkout');
});

// Profile route (protected)
app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile');
});

// ========================
// START SERVER
// ========================
app.listen(PORT, function() {
    console.log('Server running at http://localhost:' + PORT);
});
