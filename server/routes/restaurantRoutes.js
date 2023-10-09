const express = require('express');
const Router = express.Router();
const {validateLogin} = require('../middlewares/inputValidation.js');
const {restaurantLogin} = require('../controllers/restaurantControllers.js');


Router.post('/login', validateLogin, restaurantLogin);

