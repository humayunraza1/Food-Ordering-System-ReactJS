const express = require('express');
const Router = express.Router();
const {register, login} = require('../controllers/userControllers.js');
const {validateRegistration, validateLogin} = require('../middlewares/inputValidation.js');
const emailUniquenessCheck = require('../middlewares/emailUniqueness.js');

Router.post('/register', validateRegistration, emailUniquenessCheck, register);
Router.post('/login', validateLogin, login);

module.exports = Router;