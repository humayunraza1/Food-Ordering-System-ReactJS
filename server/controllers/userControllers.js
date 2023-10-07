const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getConnection } = require('../connection.js');
const secretKey = process.env.JWT_SECRET_KEY;
const oracledb = require('oracledb')

const register = async (req, res) => {
    const { fullName, email, password, phoneNumber, address } = req.body;

    try {
        //Connecting to database each time a user registers
        const connection = await getConnection();
        const HashedPassword = await bcrypt.hash(password,10);

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
    const { email, password } = req.body;

    try {
        const connection = await getConnection();
        const result = await connection.execute(
            `SELECT email, password FROM USERS WHERE email=:email`,
            [email],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        const user = result.rows[0];

        if (user && (await bcrypt.compare(password, user.PASSWORD))) {
            const token = jwt.sign({ userId: user.UserID, role: user.Role }, secretKey, {
                expiresIn: '1h',
            });
            connection.close();
            return res.status(200).json({
                'status':'success',
                'message':'Login Successful!'
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

module.exports = {
    register,
    login,
}