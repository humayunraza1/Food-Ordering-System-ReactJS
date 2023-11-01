const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getConnection } = require('../connection.js');
const secretKey = process.env.JWT_SECRET_KEY;
const oracledb = require('oracledb')



const restaurantLogin = async (req, res) => {
    let { email, password } = req.body;
    if (!email || !password) {
        console.log(`Restaurant didnt fill all login details (restaurantController/restaurantLogin)`);
        return res.status(400).json({
            'status': 'error',
            'message': 'Please enter all the details!'
        })
    }
    email = email.toLowerCase();
    try {
        const connection = await getConnection();
        const result = await connection.execute(
            `SELECT RestaurantID, email, password FROM RESTAURANTS WHERE email=:email`,
            [email],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        const RESTAURANTS = result.rows[0];
        console.log(RESTAURANTS);

        if (RESTAURANTS && (await bcrypt.compare(password, RESTAURANTS.PASSWORD))) {
            const token = jwt.sign({ restaurantId: RESTAURANTS.RESTAURANTID }, secretKey, {
                expiresIn: '1h',
            });
            connection.close();
            return res.status(200).json({
                'status': 'success',
                'message': 'Login Successful!',
                'token': token,
                'redirectUrl': '/restaurants/getRecentOrders'
            })
        }
        else {
            connection.close();
            return res.status(401).json({
                'status': 'error',
                'message': 'Invalid Credentials!'
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

const addProduct = async (req, res) => {
    const { restaurantId } = req.restaurant;
    let { name, description, category, price } = req.body;
    if (!name || !description || !category || !price) {
        console.log(`Restaurant didnt fill all product details (restaurantController/addProduct)`);
        return res.status(400).json({
            'status': 'error',
            'message': 'Please enter all the details!'
        })
    }
    name = name.toUpperCase();
    try {
        const connection = await getConnection();
        await connection.execute(
            `INSERT INTO RESTAURANTITEMS (restaurantId, name, description, Category, price) VALUES (:restaurantId, :name, 
                :description, :category, :price)`,
            [restaurantId, name, description, category, price],
            { autoCommit: true }
        );
        connection.close();
        return res.status(200).json({
            'status': 'success',
            'message': 'Product Item added successfully!'
        })

    }
    catch (err) {
        console.log(`Error from addProduct function ${err}`);
        return res.status(500).json({
            'status': 'error',
            'message': 'This is an issue from our end please try again later!'
        })
    }
}

const searchProduct = async (req, res) => {
    const { restaurantId } = req.restaurant;
    let { name } = req.query;
    if (!name) {
        try {
            const connection = await getConnection();
            const result = await connection.execute(
                `SELECT * FROM RESTAURANTITEMS WHERE restaurantId=:restaurantId`,
                [restaurantId],
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );
            connection.close();
            if (result.rows.length === 0) {
                return res.status(404).json({
                    'status': 'error',
                    'message': 'No Products Found!'
                })
            }
            return res.status(200).json({
                'status': 'success',
                'message': 'Details Fetched Successfully!',
                'data': result.rows
            })

        } catch (err) {
            console.log(`Error from searchProduct function ${err}`);
            return res.status(500).json({
                'status': 'error',
                'message': 'This is an issue from our end please try again later!'
            })
        }
    }
    name = name.toUpperCase();
    try {
        const query = `SELECT * FROM RESTAURANTITEMS WHERE restaurantId=:restaurantId AND name LIKE '%' || :name || '%'`;
        const connection = await getConnection();
        const result = await connection.execute(
            query,
            [restaurantId, name],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        connection.close();
        if (result.rows.length === 0) {
            return res.status(404).json({
                'status': 'error',
                'message': 'No Products Found!'
            })
        }
        return res.status(200).json({
            'status': 'success',
            'message': 'Details Fetched Successfully!',
            'data': result.rows

        })
    } catch (err) {
        console.log(`Error from searchProduct function ${err}`);
        return res.status(500).json({
            'status': 'error',
            'message': 'This is an issue from our end please try again later!'
        })
    }
}

const removeProduct = async (req, res) => {
    const { restaurantId } = req.restaurant;
    const { productid } = req.query;
    try {
        const connection = await getConnection();
        await connection.execute(
            `DELETE FROM RESTAURANTITEMS WHERE restaurantId=:restaurantId AND productId=:productid`,
            [restaurantId, productid],
            { autoCommit: true }
        );
        connection.close();
        return res.status(200).json({
            'status': 'success',
            'message': 'Product Removed Successfully!'
        })
    }
    catch (err) {
        console.log(`Error from removeProduct function ${err}`);
        return res.status(500).json({
            'status': 'error',
            'message': 'This is an issue from our end please try again later!'
        })
    }
}

const getRecentOrders = async (req, res) => {
    const { restaurantId } = req.restaurant;
    try {
        const connection = await getConnection();
        const result = await connection.execute(
            `SELECT * FROM ORDERS WHERE restaurantId=:restaurantId AND OrderStatus = 'Processing' OR OrderStatus = 'In Progress'`,
            [restaurantId],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        connection.close();
        if (result.rows.length === 0) {
            return res.status(404).json({
                'status': 'error',
                'message': 'No Orders Found!'
            })
        }
        return res.status(200).json({
            'status': 'success',
            'message': 'Details Fetched Successfully!',
            'data': result.rows[0]
        })
    }
    catch (err) {
        console.log(`Error from getRecentOrders function ${err}`);
        return res.status(500).json({
            'status': 'error',
            'message': 'This is an issue from our end please try again later!'
        })
    }
}

const changeOrderStatus = async (req, res) => {
    const { restaurantId } = req.restaurant;
    const { orderid } = req.body;
    try {
        const connection = await getConnection();
        let result = await connection.execute(
            `SELECT OrderStatus FROM ORDERS WHERE restaurantId=:restaurantId AND orderId=:orderid AND OrderStatus = 'Processing' OR OrderStatus = 'In Progress'`,
            [restaurantId, orderid],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        if (result.rows.length === 0) {
            return res.status(404).json({
                'status': 'error',
                'message': 'Order can not be further updated'
            })
        }
        result = result.rows[0];
        let currStatus = result.ORDERSTATUS;
        if (currStatus === 'In Progress') {
            await connection.execute(
                `UPDATE ORDERS SET OrderStatus='Delivered' WHERE restaurantId=:restaurantId AND orderId=:orderId`,
                [restaurantId, orderid],
                { autoCommit: true }
            );
            currStatus = 'Delivered';
        }
        else if (currStatus === 'Processing') {
            await connection.execute(
                `UPDATE ORDERS SET OrderStatus='In Progress' WHERE restaurantId=:restaurantId AND orderId=:orderId`,
                [restaurantId, orderid],
                { autoCommit: true }
            );
            currStatus = 'In Progress';
        }
        connection.close();
        return res.status(200).json({
            'status': 'success',
            'message': `Order Status Changed Successfully to ${currStatus}!`
        })
    }
    catch (err) {
        console.log(`Error from changeOrderStatus function ${err}`);
        return res.status(500).json({
            'status': 'error',
            'message': 'This is an issue from our end please try again later!'
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

