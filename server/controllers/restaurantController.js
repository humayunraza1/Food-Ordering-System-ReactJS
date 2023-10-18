const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getConnection } = require('../connection.js');
const secretKey = process.env.JWT_SECRET_KEY;
const oracledb = require('oracledb')



const restaurantLogin = async (req, res) => {
    let { email, password } = req.body;
    email = email.toLowerCase();
    try {
        const connection = await getConnection();
        const result = await connection.execute(
            `SELECT email, password FROM RESTAURANTS WHERE email=:email`,
            [email],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        const RESTAURANTS = result.rows[0];

        if (RESTAURANTS && (await bcrypt.compare(password, RESTAURANTS.PASSWORD))) {
            const token = jwt.sign({ restaurantId: RESTAURANTS.RESTAURANTID }, secretKey, {
                expiresIn: '1h',
            });
            connection.close();
            return res.status(200).json({
                'status':'success',
                'message':'Login Successful!',
                'token':token
            })
        }
        else {
            connection.close();
            return res.status(401).json({
                'status':'failed',
                'message':'Invalid Credentials!'
            })
        }

    } catch (err) {
        console.log(`Error from login function ${err}`);
        return res.status(500).json({
            'status': 'error',
            'message': 'This is an issue from our end please try again later!'
        })
    }
}

const addProduct = async (req,res) => {
    const {restaurantId} = req.restaurant;
    let {name, description, Category, price} = req.body;
    name = name.toUpperCase();
    try {
        const connection = await getConnection();
        const result = await connection.execute(
            `INSERT INTO RESTAURANTITEMS (restaurantId, name, description, Category, price) VALUES (:restaurantId, :name, 
                :description, :Category, :price)`,
            [restaurantId, name, Category, description, price],
            {outFormat: oracledb.OUT_FORMAT_OBJECT}
        );
        connection.close();
        return res.status(200).json({
            'status':'success',
            'message':'Product Item added successfully!'
        })

    } 
    catch(err) {
        console.log(`Error from addProduct function ${err}`);
        return res.status(500).json({
            'status':'error',
            'message':'This is an issue from our end please try again later!'
        })
    }
}

const searchProduct = async (req,res) => {
    const {restaurantId} = req.restaurant;
    let {name} = req.body;
    name = name.toUpperCase();
    try{
        const query = `SELECT * FROM RESTAURANTITEMS WHERE restaurantId=:restaurantId AND name LIKE '%' || :name || '%'`;
        const connection = await getConnection();
        const result = await connection.execute(
            query,
            [restaurantId, name],
            {outFormat: oracledb.OUT_FORMAT_OBJECT}
        );
        connection.close();
        return res.status(200).json({
            'status':'success',
            'message':'Details Fetched Successfully!',
            'data':result.rows

        })
    } catch(err) {
        console.log(`Error from searchProduct function ${err}`);
        return res.status(500).json({
            'status':'error',
            'message':'This is an issue from our end please try again later!'
        })
    }
}

const removeProduct = async (req,res) => {
    const {restaurantId} = req.restaurant;
    const {productId} = req.body;
    try {
        const connection = await getConnection();
        const result = await connection.execute(
            `DELETE FROM RESTAURANTITEMS WHERE restaurantId=:restaurantId AND productId=:productId`,
            [restaurantId, productId],
            {autoCommit: true}
        );
        connection.close();
        return res.status(200).json({
            'status':'success',
            'message':'Product Removed Successfully!'
        })
    }
    catch(err) {
        console.log(`Error from removeProduct function ${err}`);
        return res.status(500).json({
            'status':'error',
            'message':'This is an issue from our end please try again later!'
        })
    }
}

const getRecentOrders = async (req,res) => {
    const {restaurantId} = req.restaurant;
    try {
        const connection = await getConnection();
        const result = await connection.execute(
            `SELECT * FROM ORDERS WHERE restaurantId=:restaurantId AND OrderStatus = 'Processing' OR OrderStatus = 'In Progress'`,
            [restaurantId],
            {outFormat: oracledb.OUT_FORMAT_OBJECT}
        );
        connection.close();
        return res.status(200).json({
            'status':'success',
            'message':'Details Fetched Successfully!',
            'data':result.rows[0]
        })
    }
    catch(err) {
        console.log(`Error from getRecentOrders function ${err}`);
        return res.status(500).json({
            'status':'error',
            'message':'This is an issue from our end please try again later!'
        })
    }
}

const changeOrderStatus = async (req,res) => {
    const {restaurantId} = req.restaurant;
    const {orderId} = req.body;
    try {
        const connection = await getConnection();
        let result = await connection.execute(
            `SELECT OrderStatus FROM ORDERS WHERE restaurantId=:restaurantId AND orderId=:orderId`,
            [restaurantId, orderId],
            {autoCommit: true}
        );
        result = result.rows[0];
        const currStatus = result.ORDERSTATUS;
        if (currStatus === 'In Progress') {
            await connection.execute(
                `UPDATE ORDERS SET OrderStatus='Delivered' WHERE restaurantId=:restaurantId AND orderId=:orderId`,
                [restaurantId, orderId],
                {autoCommit: true}
            );
        }
        else if (currStatus === 'Processing') {
            await connection.execute(
                `UPDATE ORDERS SET OrderStatus='In Progress' WHERE restaurantId=:restaurantId AND orderId=:orderId`,
                [restaurantId, orderId],
                {autoCommit: true}
            );
        }
        connection.close();
        return res.status(200).json({
            'status':'success',
            'message':'Order Status Changed Successfully!'
        })
    }
    catch(err) {
        console.log(`Error from changeOrderStatus function ${err}`);
        return res.status(500).json({
            'status':'error',
            'message':'This is an issue from our end please try again later!'
        })
    }
}



module.exports = {
    restaurantLogin,
    addProduct,
    searchProduct,
    removeProduct,
    getRecentOrders,
    changeOrderStatus,
    
}