const config = require('../config');

function apiKeyMiddleware(req, res, next) {
    
    if (!config.USE_API_KEY) {
        return next();
    }

    const providedKey = req.headers['x-api-key'];

    if (!providedKey || providedKey !== config.API_KEY) {
        console.log(`[WARN] (apiAuth): Unauthorized access. IP: ${req.ip}`);
        return res.status(401).json({
            success: false,
            message: 'Unauthorized access. You must provide a valid x-api-key header.'
        });
    }

    next();
}

module.exports = apiKeyMiddleware;