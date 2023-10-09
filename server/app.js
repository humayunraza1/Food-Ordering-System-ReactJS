const express = require('express');
const app = express();
require('dotenv').config();
const userRoutes = require('./routes/userRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js');
const restaurantRoutes = require('./routes/restaurantRoutes.js');

const PORT = 3001;

app.use(express.json());

app.use('/users', userRoutes);
app.use('/admin', adminRoutes);
app.use('/restaurants', restaurantRoutes);

app.listen(PORT, ()=>{
    console.log(`App running on http://localhost:${PORT}`);
});