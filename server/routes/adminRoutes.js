const express = require('express');
const Router = express.Router();
const {authorize, isAdmin} = require('../middlewares/authorizationMiddleware.js');
const adminController = require('../controllers/adminController.js');

Router.get('/admin-dashboard', authorize, isAdmin, adminController.adminDetails);

Router.get('/search-user', authorize, isAdmin, adminController.searchUser);

Router.get('/search-restaurant', authorize, isAdmin, adminController.searchRestaurant);

Router.post('/add-restaurants', authorize, isAdmin, adminController.addRestaurants);

Router.delete('/remove-user', authorize, isAdmin, adminController.removeUser);

Router.delete('/remove-restaurant', authorize, isAdmin, adminController.removeRestaurant);



module.exports = Router;