// ========================
// IS LOGGED IN MIDDLEWARE
// ========================
// Checks if user is logged in
// If not, redirects to login page
function isLoggedIn(req, res, next) {
    if (req.session.user) {
        return next();
    }
    req.flash('error', 'You must be logged in to access this page');
    res.redirect('/auth/login');
}

// ========================
// IS ADMIN MIDDLEWARE
// ========================
// Checks if logged in user is admin
// If not, shows access denied
function isAdmin(req, res, next) {
    if (req.session.user && req.session.user.role === 'admin') {
        return next();
    }
    req.flash('error', 'Access Denied! Admins only.');
    res.redirect('/auth/login');
}

module.exports = { isLoggedIn, isAdmin };
