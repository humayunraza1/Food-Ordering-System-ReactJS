const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET_KEY;

const authorize = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ 
            'status': 'error',
            'message': 'Unauthorized',
            'redirectUrl': '/login'
        });
    }
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            console.log('Verify error');
          return res.status(401).json({ "error": 'Unauthorized' });
        }
        req.user=decoded;
    });
    
    next();
}

const isUser = (req, res, next) => {
    if (req.user.role !== 'user') {
        return res.status(401).json({ 'error': 'Unauthorized' });
    }
    next();
}

const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(401).json({ 'error': 'Unauthorized' });
    }
    next();
}

module.exports = {
    authorize,
    isAdmin,
    isUser,
}