const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

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
    next();
});

// ========================
// WEB ROUTES
// ========================
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const adminRoutes = require('./routes/admin');
const { isAdmin } = require('./middleware/auth');

app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/admin', isAdmin, adminRoutes);

// Home route
app.get('/', function(req, res) {
    res.render('index');
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
// START SERVER
// ========================
app.listen(PORT, function() {
    console.log(`Server running at http://localhost:${PORT}`);
});
