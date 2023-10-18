const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getConnection } = require('../connection.js');
const secretKey = process.env.JWT_SECRET_KEY;
const oracledb = require('oracledb')

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const phoneNumberRegex = /^\d{11}$/;

const register = async (req, res) => {
    let { fullName, email, password, phoneNumber, address } = req.body;
    email = email.toLowerCase();
    
    
    if (password.length < 6) {
        return res.status(400).json({
            'status': 'error',
            'message': 'Password should be 6 characters or more'
        });
    }
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            'status': 'error',
            'message': 'Invalid email format'
        });
    }
    if (!phoneNumberRegex.test(phoneNumber)) {
        return res.status(400).json({
            'status': 'error',
            'message': 'Invalid phone number format (should be 11 digits)'
        });
    }
    try {

        const connection = await getConnection();
        const HashedPassword = await bcrypt.hash(password, 10);

        const result = await connection.execute(
            `INSERT INTO USERS (fullName, email, password, phone_number, address) values (:fullName, :email, :password, :phone_number, :address)`,
            [fullName, email, HashedPassword, phoneNumber, address],
            { autoCommit: true }
        );

        connection.close();
        return res.status(200).json({
            'status': 'success',
            'message': 'User Registered Successfully'
        })



    } catch (err) {
        console.log(`Error from register function ${err}`);
        return res.status(500).json({
            'status': 'error',
            'message': 'This is an issue from our end please try again later!'
        })
    }
}


const login = async (req, res) => {
    let { email, password } = req.body;
    email = email.toLowerCase();
    try {
        const connection = await getConnection();
        const result = await connection.execute(
            `SELECT UserID, Role, email, password FROM USERS WHERE email=:email`,
            [email],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        const user = result.rows[0];
        connection.close();

        if (user && (await bcrypt.compare(password, user.PASSWORD))) {
            const token = jwt.sign({ userId: user.USERID, role: user.ROLE }, secretKey, {
                expiresIn: '1h',
            });
            let redirectUrl='';
            if (user.ROLE == 'admin') {
                redirectUrl = '/admin/admin-dashboard';
            }
            else if (user.ROLE === 'user') {
                redirectUrl = '/users/user-details';
            }
            return res.status(200).json({
                'status': 'success',
                'message': 'User Logged In Successfully!',
                'token': token,
                'redirectUrl': redirectUrl
            });


        }

        return res.status(401).json({
            'status': 'failed',
            'message': 'Invalid Credentials!'
        })


    } catch (err) {
        console.log(`Error from login function ${err}`);
        return res.status(500).json({
            'status': 'error',
            'message': 'This is an issue from our end please try again later!'
        })
    }
}

const logout = async (req, res) => {
    return res.status(200).json({
        'status': 'success',
        'message': 'User Logged Out Successfully!',
        'redirectUrl': '/users/login'
      });
}

const displayUserDetails = async (req, res) => {
    const { userId } = req.user;
    // console.log(userId);
    try {
        const connection = await getConnection();
        const result = await connection.execute(
            `SELECT fullName, email, phone_number, address FROM USERS WHERE UserID=:UserID`,
            [userId],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        userData = result.rows[0];
        connection.close();
        if (userData) {
            return res.status(200).json({
                'status': 'success',
                'message': 'User Details Fetched Successfully!',
                'data': userData
            })
        }
        return res.status(404).json({
            'status': 'failed',
            'message': 'User Not Found!'
        })

    } catch (err) {
        console.log(`Error from displayUserDetails function ${err}`);
        return res.status(500).json({
            'status': 'error',
            'message': 'This is an issue from our end please try again later!'
        })
    }

}

const updateUserDetails = async (req, res) => {
    const {userId} = req.user;
    let {fullName, oldpassword, newpassword, phoneNumber, address} = req.body;
    try {
        const connection = await getConnection();
        if (fullName) { // Update Name
            await connection.execute(
                `UPDATE USERS SET fullName=:fullName WHERE UserID=:UserID`,
                [fullName, userId],
                { autoCommit: true }
            );
        }
        if (newpassword && newpassword.length >= 6) { // Update Password
            // const HashedOldPassword = await bcrypt.hash(oldpassword, 10);
            const HashedNewPassword = await bcrypt.hash(newpassword, 10);
            const result = await connection.execute(
                `SELECT password FROM USERS WHERE UserID=:UserID`,
                [userId],
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );
            const user = result.rows[0];
            if(!await bcrypt.compare(oldpassword, user.PASSWORD)) {
                return res.status(400).json({
                    'status': 'error',
                    'message': 'Old Password is incorrect!'
                })
            }
            if (oldpassword === newpassword) {
                return res.status(400).json({
                    'status': 'error',
                    'message': 'New Password cannot be the same as the old password!'
                })
            }
            await connection.execute(
                `UPDATE USERS SET password=:password WHERE UserID=:UserID`,
                [HashedNewPassword, userId],
                { autoCommit: true }
            );
        }
        if (phoneNumber && phoneNumberRegex.test(phoneNumber)) { // Update Phone Number
            await connection.execute(
                `UPDATE USERS SET phone_number=:phone_number WHERE UserID=:UserID`,
                [phoneNumber, userId],
                { autoCommit: true }
            );
        }
        if (address) { // Update Address
            await connection.execute(
                `UPDATE USERS SET address=:address WHERE UserID=:UserID`,
                [address, userId],
                { autoCommit: true }
            );
        }
        connection.close();
        return res.status(200).json({
            'status': 'success',
            'message':'user details updated successfully'
        })
            

    } catch(err) {
        console.log(`Error from updateUserDetails function ${err}`);
        return res.status(500).json({
            'status': 'error',
            'message': 'This is an issue from our end please try again later!'
        })
    }
}

const browseRestaurants = async (req,res) => {
    try {
        const connection = await getConnection();
        const result = await connection.execute(
            `SELECT RestaurantID, email, RestaurantName, address, phone_number, website FROM RESTAURANTS`,
            [],
            {outFormat: oracledb.OUT_FORMAT_OBJECT}
        );
        connection.close();
        return res.status(200).json({
            'status':'success',
            'message':'Details Fetched Successfully!',
            'data':result.rows

        })
    } catch(err) {
        console.log(`Error from browseRestaurants function ${err}`);
        return res.status(500).json({
            'status':'error',
            'message':'This is an issue from our end please try again later!'
        })
    }
}

const searchRestaurant = async(req,res) => {
    let {name} = req.body;
    name = name.toUpperCase();
    try {
        const connection = await getConnection();
        const result = await connection.execute(
            `SELECT RestaurantID, email, RestaurantName, address, phone_number, website FROM RESTAURANTS WHERE name LIKE '%' || :name || '%'`,
            [name],
            {outFormat: oracledb.OUT_FORMAT_OBJECT}
        );
        connection.close();
        return res.status(200).json({
            'status':'success',
            'message':'Details Fetched Successfully!',
            'data':result.rows

        })
    } catch(err) {
        console.log(`Error from searchRestaurant function ${err}`);
        return res.status(500).json({
            'status':'error',
            'message':'This is an issue from our end please try again later!'
        })
    }
}

const browseProducts = async (req,res) => {
    const {restaurantId} = req.body;
    try {
        const connection = await getConnection();
        const result = await connection.execute(
            `SELECT * FROM RESTAURANTITEMS WHERE restaurantId=:restaurantId`,
            [restaurantId],
            {outFormat: oracledb.OUT_FORMAT_OBJECT}
        );
        connection.close();
        return res.status(200).json({
            'status':'success',
            'message':'Details Fetched Successfully!',
            'data':result.rows

        })
    } catch(err) {
        console.log(`Error from browseProducts function ${err}`);
        return res.status(500).json({
            'status':'error',
            'message':'This is an issue from our end please try again later!'
        })
    }

}

const placeOrder = async (req,res) => {
    let total = 0;
    const {userId} = req.user;
    const {restaurantId, products} = req.body;
    try {
        const connection = await getConnection();
        for (let i=0; i<products.length; i++) {
            const result = await connection.execute(
                `SELECT price FROM RESTAURANTITEMS WHERE productId=:productId`,
                [products[i].productId],
                {outFormat: oracledb.OUT_FORMAT_OBJECT}
            );
            const price = result.rows[0].PRICE;
            total += price*products[i].quantity;
        }
        const orderStatus = 'Processing';
        const orderDate = formatDatetime(new Date());
        const result = await connection.execute(
            `INSERT INTO ORDERS (UserID, RestaurantID, OrderTimeDate, OrderStatus, GRANDTOTAL) values (:userId, :restaurantId, :orderDate, :orderStatus,
                 :total)`,
            [userId, restaurantId, orderDate, orderStatus, total],
            {autoCommit: true}
        );
        const orderId = result.rows[0].ORDERID;
        for (let i=0; i<products.length; i++) {
            let subtotal = 0;
            const result = await connection.execute(
                `SELECT price FROM RESTAURANTITEMS WHERE productId=:productId`,
                [products[i].productId],
                {outFormat: oracledb.OUT_FORMAT_OBJECT}
            );
            const price = result.rows[0].PRICE;
            subtotal += price * products[i].quantity;
            await connection.execute(
                `INSERT INTO ORDER_DETAILS (OrderID, ProductID, Quantity, Subtotal) values (:orderId, :productId, :quantity, :subtotal)`,
                [orderId, products[i].productId, products[i].quantity, subtotal],
                {autoCommit: true}
            )
        }
        connection.close(); 
        return res.status(200).json({
            'status':'success',
            'message':'Order Placed Successfully!',
            'orderId':orderId
        });
    }
    catch (err) {
        console.log(`Error from placeOrder function ${err}`);
        return res.status(500).json({
            'status':'error',
            'message':'This is an issue from our end please try again later!'
        })
    }
    
}

const getOrderHistory = async (req,res) => {
    const {userId} = req.user;
    try {
        const connection = await getConnection();
        const result = await connection.execute(
            `SELECT OrderID, RESTAURANTS.RestaurantName, OrderTimeDate, OrderStatus, GRANDTOTAL
             FROM ORDERS
             inner join RESTAURANTS ON ORDERS.RestaurantID = RESTAURANTS.RestaurantID
             WHERE UserID=:userId
             ORDER BY OrderTimeDate DESC
             FETCH FIRST 10 ROWS ONLY`,
            [userId],
            {outFormat: oracledb.OUT_FORMAT_OBJECT}
        );
        connection.close();
        return res.status(200).json({
            'status':'success',
            'message':'Details Fetched Successfully!',
            'data':result.rows

        })
    }
    catch(err) {
        console.log(`Error from getOrderHistory function ${err}`);
        return res.status(500).json({
            'status':'error',
            'message':'This is an issue from our end please try again later!'
        })
    }
}

const getOrderDetails = async (req,res) => {
    const {orderId} = req.body;
    try {
        const connection = await getConnection();
        const result = await connection.execute(
            `SELECT RESTAURANTS.RestaurantName, OrderTimeDate, OrderStatus, PRODUCTS.NAME, ORDER_DETAILS.Quantity,
             ORDER_DETAILS.SUBTOTAL, GRANDTOTAL
             FROM ORDERS
             inner join RESTAURANTS ON ORDERS.RestaurantID = RESTAURANTS.RestaurantID
             inner join ORDER_DETAILS ON ORDERS.OrderID = ORDER_DETAILS.OrderID
             inner join RESTAURANTITEMS ON ORDER_DETAILS.ProductID = RESTAURANTITEMS.ProductID
             WHERE ORDERS.OrderID=:orderId`,
            [orderId],
            {outFormat: oracledb.OUT_FORMAT_OBJECT}
        );
        connection.close();
        return res.status(200).json({
            'status':'success',
            'message':'Details Fetched Successfully!',
            'data':result.rows

        })
    }
    catch(err) {
        console.log(`Error from getOrderDetails function ${err}`);
        return res.status(500).json({
            'status':'error',
            'message':'This is an issue from our end please try again later!'
        })
    }
}



const formatDatetime = (datetime) => {
    const year = datetime.getFullYear();
    const month = String(datetime.getMonth() + 1).padStart(2, '0'); // Month is zero-based
    const day = String(datetime.getDate()).padStart(2, '0');
    const hours = String(datetime.getHours()).padStart(2, '0');
    const minutes = String(datetime.getMinutes()).padStart(2, '0');
    const seconds = String(datetime.getSeconds()).padStart(2, '0');
    const milliseconds = String(datetime.getMilliseconds()).padStart(3, '0');
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
}

module.exports = {
    register,
    login,
    displayUserDetails,
    updateUserDetails,
    logout,
    browseRestaurants,
    searchRestaurant,
    browseProducts,
    placeOrder,
    getOrderHistory,
    getOrderDetails,
}