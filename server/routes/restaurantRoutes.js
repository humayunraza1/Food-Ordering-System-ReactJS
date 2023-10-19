const express = require('express');
const Router = express.Router();
const {validateLogin} = require('../middlewares/inputValidation.js');
const {restaurantLogin, addProduct, searchProduct, getRecentOrders,
      changeOrderStatus, removeProduct} = require('../controllers/restaurantController.js');
const {restaurantAuthorization} = require('../middlewares/restaurantAuth.js');


Router.post('/login', validateLogin, restaurantLogin);
Router.post('/addProduct', restaurantAuthorization, addProduct); //

Router.get('/searchProduct', restaurantAuthorization, searchProduct); //
Router.get('/getRecentOrders', restaurantAuthorization, getRecentOrders); // 
Router.put('/updateOrderStatus', restaurantAuthorization, changeOrderStatus); //

Router.delete('/deleteProduct', restaurantAuthorization, removeProduct); //

module.exports = Router;