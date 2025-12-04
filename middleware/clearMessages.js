/**
 * Middleware to clear flash messages after they've been displayed
 * This ensures messages are only shown once and don't persist across page loads
 * 
 * This middleware wraps res.render to automatically clear messages after rendering
 */

function clearMessagesAfterRender(req, res, next) {
    // Store original render function
    const originalRender = res.render.bind(res);
    
    // Override render to clear messages after rendering
    res.render = function(view, options, callback) {
        // If a callback was provided, wrap it to clear messages
        if (callback) {
            const wrappedCallback = (err, html) => {
                // Clear messages after render completes
                if (req.session && req.session.messages) {
                    req.session.messages = [];
                }
                callback(err, html);
            };
            return originalRender.call(this, view, options, wrappedCallback);
        }
        
        // If no callback, provide one that clears messages and sends response
        return originalRender.call(this, view, options, (err, html) => {
            // Clear messages after render completes
            if (req.session && req.session.messages) {
                req.session.messages = [];
            }
            
            if (err) {
                // If there's an error, handle it
                if (!res.headersSent) {
                    res.status(500).send('Internal Server Error');
                }
            } else if (html && !res.headersSent) {
                // Send the rendered HTML if headers haven't been sent
                res.send(html);
            }
        });
    };
    
    next();
}

module.exports = clearMessagesAfterRender;

