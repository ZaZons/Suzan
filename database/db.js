require('dotenv').config();
const mysql = require('mysql2/promise');
let connection;

module.exports = mysql.createConnection({
	user: process.env.mySQLUser,
	password: process.env.mySQLPassword,
	database: process.env.mySQLDb
});