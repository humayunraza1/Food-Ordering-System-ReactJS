const express = require('express');
const Router = express.Router();

const {register, login, displayUserDetails, updateUserDetails, logout, browseRestaurants,
      searchRestaurant, browseProducts, placeOrder, getOrderHistory, getOrderDetails} = require('../controllers/userControllers.js');
const {validateRegistration, validateLogin} = require('../middlewares/inputValidation.js');

const emailUniquenessCheck = require('../middlewares/emailUniqueness.js');
const {authorize, isUser} = require('../middlewares/authorizationMiddleware.js');


Router.post('/register', validateRegistration, emailUniquenessCheck, register);
Router.post('/login', validateLogin, login);
Router.post('/placeOrder', authorize, isUser, placeOrder);

Router.get('/user-details', authorize, isUser, displayUserDetails);
Router.get('/logout', authorize, isUser, logout);
Router.get('/home', authorize, isUser, browseRestaurants);
Router.get('/searchRestaurant', authorize, isUser, searchRestaurant);
Router.get('/browseProducts', authorize, isUser, browseProducts);
Router.get('/orderHistory', authorize, isUser, getOrderHistory);
Router.get('/orderDetails', authorize, isUser, getOrderDetails);

Router.put('/update-user-details', authorize, isUser, updateUserDetails);


module.exports = Router;