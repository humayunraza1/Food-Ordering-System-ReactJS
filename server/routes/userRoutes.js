const express = require('express');
const Router = express.Router();

const {register, login, displayUserDetails, updateUserDetails, logout} = require('../controllers/userControllers.js');
const {validateRegistration, validateLogin} = require('../middlewares/inputValidation.js');

const emailUniquenessCheck = require('../middlewares/emailUniqueness.js');
const {authorize, isUser} = require('../middlewares/authorizationMiddleware.js');


Router.post('/register', validateRegistration, emailUniquenessCheck, register);
Router.post('/login', validateLogin, login);

Router.get('/user-details', authorize, isUser, displayUserDetails);
Router.get('/logout', authorize, isUser, logout);

Router.put('/update-user-details', authorize, isUser, updateUserDetails);


module.exports = Router;