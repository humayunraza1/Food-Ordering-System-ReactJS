const express = require('express');
const Router = express.Router();

const {register, login, displayUserDetails, updateUserDetails, logout, browseRestaurants,
      searchRestaurant, browseProducts, placeOrder, getOrderHistory, getOrderDetails} = require('../controllers/userControllers.js');

// MIDDLEWARES
const {validateRegistration, validateLogin} = require('../middlewares/inputValidation.js');
const emailUniquenessCheck = require('../middlewares/emailUniqueness.js');
const {authorize, isUser} = require('../middlewares/authorizationMiddleware.js');

// -------------------------------------------------------------------------------------------------------------

Router.post('/register', validateRegistration, emailUniquenessCheck, register); // /users/register 
Router.post('/login', validateLogin, login);                                    // /users/login

// Router.get('/logout', authorize, isUser, logout);

Router.post('/placeOrder', authorize, isUser, placeOrder); //  

Router.get('/user-details', authorize, isUser, displayUserDetails);             // /users/user-details
Router.put('/update-user-details', authorize, isUser, updateUserDetails);       // /users/update-user-details

// Router.get('/home', authorize, isUser, browseRestaurants); // 
// Router.get('/searchRestaurant', authorize, isUser, searchRestaurant); //
// Router.get('/browseProducts', authorize, isUser, browseProducts); // 

Router.get('/orderHistory', authorize, isUser, getOrderHistory); // 

Router.get('/orderDetails', authorize, isUser, getOrderDetails); // 



module.exports = Router;