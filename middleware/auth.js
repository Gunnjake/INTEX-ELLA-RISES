/**
 * Authentication Middleware
 * Checks if user is logged in
 */

function requireAuth(req, res, next) {
    if (req.session && req.session.user) {
        // User is authenticated
        req.user = req.session.user;
        next();
    } else {
        // User is not authenticated, redirect to login
        req.session.returnTo = req.originalUrl;
        res.redirect('/login');
    }
}

/**
 * Check if user has manager role
 */
function requireManager(req, res, next) {
    if (req.session && req.session.user && req.session.user.role === 'manager') {
        req.user = req.session.user;
        next();
    } else {
        // User is not a manager, redirect to dashboard or show error
        res.status(403).render('error', {
            title: 'Access Denied',
            message: 'You do not have permission to access this page. Manager access required.',
            user: req.session.user || null
        });
    }
}

module.exports = {
    requireAuth,
    requireManager
};
