const express = require('express');
const router = express.Router();
const User = require('../models/User');

// ========================
// REGISTER - GET
// ========================
router.get('/register', function(req, res) {
    res.render('auth/register', {
        messages: req.flash()
    });
});

// REGISTER - POST
router.post('/register', async function(req, res) {
    try {
        const { name, email, password, confirmPassword } = req.body;

        // Validation
        if (!name || !email || !password || !confirmPassword) {
            req.flash('error', 'All fields are required');
            return res.redirect('/auth/register');
        }

        if (password.length < 6) {
            req.flash('error', 'Password must be at least 6 characters');
            return res.redirect('/auth/register');
        }

        if (password !== confirmPassword) {
            req.flash('error', 'Passwords do not match');
            return res.redirect('/auth/register');
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            req.flash('error', 'Email already registered');
            return res.redirect('/auth/register');
        }

        // Create new user
        const newUser = new User({ name, email, password });
        await newUser.save();

        req.flash('success', 'Registration successful! Please login');
        res.redirect('/auth/login');

    } catch (err) {
        console.error('REGISTRATION ERROR:', err.message);
        req.flash('error', err.message);
        res.redirect('/auth/register');
    }
});

// ========================
// LOGIN - GET
// ========================
router.get('/login', function(req, res) {
    res.render('auth/login', {
        messages: req.flash()
    });
});

// LOGIN - POST
router.post('/login', async function(req, res) {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            req.flash('error', 'All fields are required');
            return res.redirect('/auth/login');
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            req.flash('error', 'Invalid email or password');
            return res.redirect('/auth/login');
        }

        // Compare password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            req.flash('error', 'Invalid email or password');
            return res.redirect('/auth/login');
        }

        // Save user to session
        req.session.user = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        req.flash('success', `Welcome back, ${user.name}!`);

        // Redirect based on role
        if (user.role === 'admin') {
            res.redirect('/admin');
        } else {
            res.redirect('/');
        }

    } catch (err) {
        console.error(err);
        req.flash('error', 'Something went wrong');
        res.redirect('/auth/login');
    }
});

// ========================
// LOGOUT
// ========================
router.get('/logout', function(req, res) {
    req.session.user = null;
    req.flash('success', 'You have successfully logged out');
    res.redirect('/auth/login');
});

module.exports = router;
