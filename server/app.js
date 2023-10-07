const express = require('express');
const app = express();
require('dotenv').config();
const userRoutes = require('./routes/userRoutes.js');


const PORT = 3001

app.use(express.json());

app.use('/users', userRoutes)


app.listen(PORT, ()=>{
    console.log(`App running on http://localhost:${PORT}`);
})