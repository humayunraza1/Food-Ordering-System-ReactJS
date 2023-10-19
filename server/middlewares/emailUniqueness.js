const {getConnection} = require('../connection.js');
const oracledb = require('oracledb');


const emailUniquenessCheck = async (req, res, next) => {
    let {email} = req.body;
    email = email.toLowerCase();
    try {
        const connection = await getConnection();
        const emailCheck = await connection.execute(
            `SELECT COUNT(*) as userCount FROM users WHERE email = :email`,
            [email],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        if (emailCheck.rows[0].USERCOUNT>0) {
            connection.close();
            return res.status(400).json({
                'status':'error',
                'message':'User with provided email already exists'
            })
        }
        connection.close();
        next();
    } catch(err) {
        console.log(`Error from email uniqueness block ${err}`);
        return res.status(500).json({
            'status':'error',
            'message':'This is an issue from our end please try again later!'
        })
    }
}

module.exports = emailUniquenessCheck;