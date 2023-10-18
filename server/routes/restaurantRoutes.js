const express = require('express');
const Router = express.Router();
const {validateLogin} = require('../middlewares/inputValidation.js');
const restaurantController = require('../controllers/restaurantControllers.js');
const {restaurantAuthorization} = require('../middlewares/restaurantAuth.js');


Router.post('/login', validateLogin, restaurantController.restaurantLogin);
Router.post('/addProduct', restaurantAuthorization, restaurantController.addProduct);

Router.get('/searchProduct', restaurantAuthorization, restaurantController.searchProduct);
Router.get('/getRecentOrders', restaurantAuthorization, restaurantController.getRecentOrders);
Router.put('/updateOrderStatus', restaurantAuthorization, restaurantController.updateOrderStatus);

Router.delete('/deleteProduct', restaurantAuthorization, restaurantController.removeProduct);