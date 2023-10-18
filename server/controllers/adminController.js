const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getConnection } = require('../connection.js');
const secretKey = process.env.JWT_SECRET_KEY;
const oracledb = require('oracledb')


const adminDetails = async (req, res) => {
    try {
        const connection = await getConnection();
        const result1 = await connection.execute(
            `SELECT userID, fullName, email, phone_number FROM USERS WHERE Role = 'user' FETCH FIRST 15 ROWS ONLY`,
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        const result2 = await connection.execute(
            `SELECT RestaurantID, RestaurantName FROM RESTAURANTS FETCH FIRST 15 ROWS ONLY`,
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        
        const result3 = await connection.execute(
            `SELECT OrderID, OrderStatus FROM ORDERS ORDER BY DESC FETCH FIRST 15 ROWS ONLY`,
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        const userData = result1.rows;
        const restaurantData = result2.rows;
        connection.close();
        return res.status(200).json({
            'status':'success',
            'message':'Dashboard Details',
            'data':{
                'users': userData,
                'restaurants': restaurantData,
                'order':result3.rows
            }
        })

    } catch(err) {
        console.log(`Error from adminDetails function: ${err}`);
        return res.status(500).json({
            'status': 'error',
            'message': 'This is an issue from our end please try again later!'
        })
    }
}


const searchUser = async (req, res) => {
    let { email, phone_number } = req.body;
    
    if (email) {
        email = email.toLowerCase();
        const user = await searchByEmail('USERS',email);
        
        return res.status(200).json({
            'status': 'success',
            'message': 'User Found',
            'data': user
        })
    }
    if (phone_number) {
        const user = await searchByNumber('USERS',phone_number);
        return res.status(200).json({
            'status': 'success',
            'message': 'User Found',
            'data': user
        })
    }

}

const searchRestaurant = async (req, res) => {
    let { email, phone_number } = req.body;
    
    if (email) {
        email = email.toLowerCase();
        const restaurant = await searchByEmail('RESTAURANTS',email);
        return res.status(200).json({
            'status': 'success',
            'message': 'Restaurant Found',
            'data': restaurant
        })
    }
    if (phone_number) {
        const restaurant = await searchByNumber('RESTAURANTS',phone_number);
        return res.status(200).json({
            'status': 'success',
            'message': 'Restaurant Found',
            'data': restaurant
        })
    }

}

const addRestaurants = async (req,res) => {
    const {email, password, restaurantName, address, phone_number, website} = req.body;
    try {
        const connection = await getConnection();
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await connection.execute(
            `INSERT INTO RESTAURANTS (email, password, restaurantName, address, phone_number, website) VALUES (:email, :password, :restaurantName, :address, :phone_number, :wesbite)`,
            [email, hashedPassword, restaurantName, address, phone_number, website],
            { outFormat: oracledb.OUT_FORMAT_OBJECT },
        
        );
        connection.close();
        return res.status(200).json({
            'status':'success',
            'message':'Restaurant Added Successfully!'
        })

    } catch (err) {
        console.log(`Error from addRestaurant function ${err}`);
        return res.status(500).json({
            'status': 'error',
            'message': 'This is an issue from our end please try again later!'
        })
    }
}

const removeUser = async (req,res) => {
    const {UserID} = req.body;
    try {
        const connection = await getConnection();
        const result = await connection.execute(
            `DELETE FROM USERS WHERE UserID=:UserID`,
            [UserID],
            {autoCommit: true}

        );
        connection.close();
        return res.status(200).json({
            'status':'success',
            'message':'User Removed Successfully!'
        })

    } catch (err) {
        console.log(`Error from removeUser function ${err}`);
        return res.status(500).json({
            'status': 'error',
            'message': 'This is an issue from our end please try again later!'
        })
    }
}

const removeRestaurant = async (req,res) => {
    const {RestaurantID} = req.body;
    try {
        const connection = await getConnection();
        const result = await connection.execute(
            `DELETE FROM RESTAURANTS WHERE RestaurantID=:RestaurantID`,
            [RestaurantID],
            {autoCommit: true}
        );
        connection.close();
        return res.status(200).json({
            'status':'success',
            'message':'Restaurant Removed Successfully!'
        })

    } catch (err) {
        console.log(`Error from removeRestaurant function ${err}`);
        return res.status(500).json({
            'status': 'error',
            'message': 'This is an issue from our end please try again later!'
        })
    }
}

// Helper Functions
const searchByEmail = async (table, email) => {
    try {
        const connection = await getConnection();
        const query = `SELECT * FROM ${table} WHERE email LIKE '%' || :email || '%'`;
        const result = await connection.execute(
            query,
            [email],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        const data = result.rows;
        connection.close();
        return data;

    } catch (err) {
        console.log(`Error from searchUser function ${err}`);
        return res.status(500).json({
            'status': 'error',
            'message': 'This is an issue from our end please try again later!'
        })
    }
}

const searchByNumber = async (table, phone_number) => {
    try {
        const connection = await getConnection();
        const query = `SELECT * FROM ${table} WHERE phone_number LIKE '%' || :phone_number || '%'`;
        const result = await connection.execute(
            query,
            [phone_number],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        const user = result.rows;
        connection.close();
        return user;

    } catch (err) {
        console.log(`Error from searchUser function ${err}`);
        return res.status(500).json({
            'status': 'error',
            'message': 'This is an issue from our end please try again later!'
        })
    }
}

module.exports = {
    adminDetails,
    searchUser,
    searchRestaurant,
    addRestaurants,
    removeUser,
    removeRestaurant,

}