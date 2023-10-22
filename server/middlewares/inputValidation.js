const validateRegistration = (req, res, next) => {
    const { fullname, email, password, phonenumber, address } = req.body;
    if (!fullname || !email || !password || !phonenumber || !address) {
        return res.status(400).json({
            'status': 'error',
            'message': 'Required Fields are missing'
        })
    }
    next();
}

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            'status': 'error',
            'message': 'Email and Password are required for login'
        })
    }
    next();
}

module.exports = {
    validateRegistration,
    validateLogin,
};

