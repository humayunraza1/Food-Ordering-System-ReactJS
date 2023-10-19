const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET_KEY;

const authorize = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ 
            'status': 'error',
            'message': 'Unauthorized, you need to login first',
            'redirectUrl': '/login'
        });
    }
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                'status': 'error', 
                'message': 'Please login again / Session expired'
            });
        }
        req.user=decoded;
        next();
    });
}

const isUser = (req, res, next) => {
    if (req.user.role !== 'user') {
        return res.status(401).json({
            'status': 'error', 
            'message': 'Only users can access this' });
    }
    next();
}

const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(401).json({ 
            'status': 'error',
            'message': 'Only admins can access this'
        });
    }
    next();
}

module.exports = {
    authorize,
    isAdmin,
    isUser,
}