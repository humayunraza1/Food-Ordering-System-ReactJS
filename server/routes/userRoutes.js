const express = require('express');
const Router = express.Router();

const { register, login, displayUserDetails, updateUserDetails, logout, browseRestaurants,
    searchRestaurant, browseProducts, placeOrder, getOrderHistory, getOrderDetails } = require('../controllers/userControllers.js');

// MIDDLEWARES
const { validateRegistration, validateLogin } = require('../middlewares/inputValidation.js');
const emailUniquenessCheck = require('../middlewares/emailUniqueness.js');
const { authorize, isUser } = require('../middlewares/authorizationMiddleware.js');

// -------------------------------------------------------------------------------------------------------------

Router.post('/register', validateRegistration, emailUniquenessCheck, register); // /users/register 
Router.post('/login', validateLogin, login);                                    // /users/login

// Router.get('/logout', authorize, isUser, logout);

Router.post('/placeOrder', authorize, placeOrder); //  

Router.get('/user-details', authorize, displayUserDetails);             // /users/user-details
Router.put('/update-user-details', authorize, updateUserDetails);       // /users/update-user-details

Router.get('/home', browseRestaurants); // 
// Router.get('/searchRestaurant', authorize, isUser, searchRestaurant); //
Router.get('/browseProducts', browseProducts); // 

Router.get('/orderHistory', authorize, getOrderHistory); // 

Router.get('/orderDetails', authorize, getOrderDetails); // 



module.exports = Router;