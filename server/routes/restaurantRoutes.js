const express = require('express');
const Router = express.Router();
const { validateLogin } = require('../middlewares/inputValidation.js');
const { restaurantLogin, addProduct, searchProduct, getRecentOrders,
    changeOrderStatus, removeProduct, getOrderDetails } = require('../controllers/restaurantController.js');
const { restaurantAuthorization } = require('../middlewares/restaurantAuth.js');


Router.post('/login', validateLogin, restaurantLogin);                                  // /restaurants/login   pass email and password in body

Router.post('/products', restaurantAuthorization, addProduct);                          // /restaurants/products 
Router.get('/products', restaurantAuthorization, searchProduct);                        // /restaurants/products?name=abc
Router.delete('/products', restaurantAuthorization, removeProduct); //                  // /restaurants/products?productid=123

Router.get('/orders', restaurantAuthorization, getRecentOrders);                        // /restaurants/orders
Router.get('/get-details', restaurantAuthorization, getOrderDetails);                        // /restaurants/orders?orderid=123
Router.put('/orders', restaurantAuthorization, changeOrderStatus);                      // /restaurants/orders?orderid=123   


module.exports = Router;