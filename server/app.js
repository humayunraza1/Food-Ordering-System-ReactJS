const express = require('express');
const app = express();
require('dotenv').config();
const userRoutes = require('./routes/userRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js');
const restaurantRoutes = require('./routes/restaurantRoutes.js');
const {browseRestaurants, browseProducts} = require('./controllers/userControllers.js')

const PORT = 3001;

app.use(express.json());


app.get('/', browseRestaurants)
app.get('/getproducts', browseProducts)

// {"restaurantID": 1} 

app.use('/users', userRoutes);
app.use('/admin', adminRoutes);
app.use('/restaurants', restaurantRoutes);

app.listen(PORT, ()=>{
    console.log(`App running on http://localhost:${PORT}`);
});