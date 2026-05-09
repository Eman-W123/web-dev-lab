const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = 3000;

// Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/rivajDB')
    .then(function() {
        console.log('Connected to MongoDB!');
    })
    .catch(function(error) {
        console.log('Connection error:', error);
    });

// Routes
const productRoutes = require('./routes/products');
const adminRoutes = require('./routes/admin');

app.use('/products', productRoutes);
app.use('/admin', adminRoutes);

// Home route
app.get('/', function(req, res) {
    res.render('index');
});

// Start server
app.listen(PORT, function() {
    console.log('Server running at http://localhost:' + PORT);
});
