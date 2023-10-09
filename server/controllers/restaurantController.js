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
            const token = jwt.sign({ userId: RESTAURANTS.RestaurantID}, secretKey, {
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

const changeStatus = async (req,res) => {
    
}



module.exports = {
    restaurantLogin,
    changeStatus,
    
}