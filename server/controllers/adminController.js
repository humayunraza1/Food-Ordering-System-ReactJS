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
            `SELECT OrderID, OrderStatus FROM ORDERS ORDER BY OrderTimeDate DESC FETCH FIRST 15 ROWS ONLY`,
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        const userData = result1.rows;
        const restaurantData = result2.rows;
        connection.close();
        return res.status(200).json({
            'status': 'success',
            'message': 'Dashboard Details',
            'data': {
                'users': userData,
                'restaurants': restaurantData,
                'order': result3.rows
            }
        })

    } catch (err) {
        console.log(`Error from adminDetails function: ${err}`);
        return res.status(500).json({
            'status': 'error',
            'message': 'This is an issue from our end please try again later!'
        })
    }
}



const searchUser = async (req, res) => {
    let { email, phonenumber } = req.query;

    if (!email && !phonenumber) {
        try {
            const connection = await getConnection();

            const result = await connection.execute(
                `SELECT userID, fullName, email, phone_number FROM USERS WHERE Role = 'user' FETCH FIRST 30 ROWS ONLY`,
                [],
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );
            connection.close();
            if (result.rows.length === 0) {
                return res.status(404).json({
                    'status': 'error',
                    'message': 'No user found'
                })
            }
            return res.status(200).json({
                'status': 'success',
                'message': 'Users Found',
                'data': result.rows
            })
        } catch (err) {
            console.log(`Error from searchUser function ${err}`);
            return res.status(500).json({
                'status': 'error',
                'message': 'This is an issue from our end please try again later!'
            })
        }

    }

    if (email) {
        email = email.toLowerCase();
        const user = await searchByEmail('USERS', email);

        if (user) {
            return res.status(200).json({
                'status': 'success',
                'message': 'User Found',
                'data': user
            })
        }
    }
    if (phonenumber) {
        const user = await searchByNumber('USERS', phonenumber);
        if (user) {
            return res.status(200).json({
                'status': 'success',
                'message': 'User Found',
                'data': user
            })
        }
    }
    return res.status(404).json({
        'status': 'error',
        'message': 'User Not Found!'
    })

}

const searchRestaurant = async (req, res) => {
    let { email, phonenumber } = req.query;

    if (!email && !phonenumber) {
        try {
            const connection = await getConnection();

            const result = await connection.execute(
                `SELECT RestaurantID, RestaurantName, email, phone_number FROM RESTAURANTS FETCH FIRST 30 ROWS ONLY`,
                [],
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );
            connection.close();
            if (result.rows.length === 0) {
                return res.status(404).json({
                    'status': 'error',
                    'message': 'No user found'
                })
            }
            return res.status(200).json({
                'status': 'success',
                'message': 'Users Found',
                'data': result.rows
            })
        } catch (err) {
            console.log(`Error from searchRestaurant function ${err}`);
            return res.status(500).json({
                'status': 'error',
                'message': 'This is an issue from our end please try again later!'
            })

        }

    }


    if (email) {
        email = email.toLowerCase();
        const restaurant = await searchByEmail('RESTAURANTS', email);
        if (restaurant) {
            return res.status(200).json({
                'status': 'success',
                'message': 'Restaurant Found',
                'data': restaurant
            })
        }
    }
    if (phonenumber) {
        const restaurant = await searchByNumber('RESTAURANTS', phonenumber);
        if (restaurant) {
            return res.status(200).json({
                'status': 'success',
                'message': 'Restaurant Found',
                'data': restaurant
            })
        }
    }

}

const addRestaurants = async (req, res) => {
    let { email, password, restaurantname, address, phonenumber, website } = req.body;
    if (!email || !password || !restaurantname || !address || !phonenumber || !website) {
        console.log(`Error from addRestaurants function: Please fill all the fields!`);
        return res.status(400).json({
            'status': 'error',
            'message': 'Please fill all the fields!'
        })
    }
    try {
        restaurantname = restaurantname.toUpperCase();
        const connection = await getConnection();
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await connection.execute(
            `INSERT INTO RESTAURANTS (email, password, restaurantName, address, phone_number, website) VALUES (:email, :password, :restaurantName, :address, :phone_number, :wesbite)`,
            [email, hashedPassword, restaurantname, address, phonenumber, website],
            { autoCommit: true }

        );
        connection.close();
        return res.status(200).json({
            'status': 'success',
            'message': 'Restaurant Added Successfully!'
        })

    } catch (err) {
        console.log(`Error from addRestaurants function ${err}`);
        return res.status(500).json({
            'status': 'error',
            'message': 'This is an issue from our end please try again later!'
        })
    }
}

const removeUser = async (req, res) => {
    const { userid } = req.query;
    if (!userid) {
        console.log(`Error from removeUser function: Please provide userid!`);
        return res.status(400).json({
            'status': 'error',
            'message': 'Please provide userid!'
        })
    }
    try {
        const connection = await getConnection();
        await connection.execute(
            `DELETE FROM USERS WHERE UserID=:userid`,
            [userid],
            { autoCommit: true }

        );
        connection.close();
        return res.status(200).json({
            'status': 'success',
            'message': 'User Removed Successfully!'
        })

    } catch (err) {
        console.log(`Error from removeUser function ${err}`);
        return res.status(500).json({
            'status': 'error',
            'message': 'This is an issue from our end please try again later!'
        })
    }
}

const removeRestaurant = async (req, res) => {
    const { restaurantid } = req.query;
    if (!restaurantid) {
        console.log(`Error from removeRestaurant function: Please provide restaurantid!`);
        return res.status(400).json({
            'status': 'error',
            'message': 'Please provide restaurantid!'
        })
    }
    try {
        const connection = await getConnection();
        await connection.execute(
            `DELETE FROM RESTAURANTS WHERE RestaurantID=:restaurantid`,
            [restaurantid],
            { autoCommit: true }
        );
        connection.close();
        return res.status(200).json({
            'status': 'success',
            'message': 'Restaurant Removed Successfully!'
        })

    } catch (err) {
        console.log(`Error from removeRestaurant function ${err}`);
        return res.status(500).json({
            'status': 'error',
            'message': 'This is an issue from our end please try again later!'
        })
    }
}

// ------------------------------------------HELPER FUNCTIONS----------------------------------------------


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
        if (data.length === 0) { return undefined; }
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
        if (user.length === 0) { return undefined; }
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