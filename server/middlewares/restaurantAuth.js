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
            console.log('Verify error');
          return res.status(401).json({ "error": 'Unauthorized' });
        }
        req.restaurant=decoded; // 'user':{'userid':userid, 'role':role}
    });
    
    next();
}

module.exports = {
    restaurantAuthorization,
}