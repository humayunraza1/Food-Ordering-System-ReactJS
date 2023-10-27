const express = require('express');
const app = express();
const cors = require('cors');

require('dotenv').config();
const userRoutes = require('./routes/userRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js');
const restaurantRoutes = require('./routes/restaurantRoutes.js');
const { browseRestaurants, browseProducts } = require('./controllers/userControllers.js')

const PORT = 3001;
// Define the list of allowed origins
const allowedOrigins = ['http://localhost:3000', 'http://192.168.18.139:3000'];

app.use(express.json());
app.use(cors({
    origin: function (origin, callback) {
        // Check if the origin is in the list of allowed origins
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,POST,PUT,DELETE', // Allow both PUT and DELETE requests
    optionsSuccessStatus: 204, // Respond with 204 No Content for OPTIONS requests
})
);


app.get('/', browseRestaurants)         // /
app.get('/restaurant', browseProducts) // /restaurant?restaurantID=1


app.use('/users', userRoutes);
app.use('/admin', adminRoutes);
app.use('/restaurants', restaurantRoutes);

app.listen(PORT, () => {
    console.log(`App running on http://localhost:${PORT}`);
});