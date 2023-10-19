const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET_KEY;

const restaurantAuthorization = (req, res, next) => {
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
            return res.status(401).json({ "error": 'Unauthorized' });
        }
        req.restaurant=decoded; 
        next();
    });
    
}

module.exports = {
    restaurantAuthorization,
}