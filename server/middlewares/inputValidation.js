const validateRegistration = (req, res, next) => {
    const {fullName, email, password, phoneNumber, address} = req.body;
    if (!fullName || !email || !password || !phoneNumber || !address) {
        return res.status(400).json({
            'status': 'error',
            'message': 'Required Fields are missing'
        })
    }
    next();
}

const validateLogin = (req, res, next) => {
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).json({
            'status':'error',
            'message':'Email and Password are required for login'
        })
    }
    next();
}

module.exports = {
    validateRegistration,
    validateLogin,
};

