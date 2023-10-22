const oracledb = require('oracledb');

async function getConnection() {
  try {
    const connection = await oracledb.getConnection({
      user: 'c##FoodOrdering',
      password: '123',
      connectString: 'DESKTOP-28APDNA/XE'
    });
    console.log('Successfully connected to oracle database');
    return connection;
  } catch (error) {
    console.error(error);
  }
}


module.exports = { getConnection }