const mysql = require('mysql');

const con = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'testdb',
});

con.connect(function(err) {
	if (err) throw err;
	console.log('Connected!!!');
	
	const table = 'cool_cars';
	const name = 'C8 Corvette';
	const manifacture = 'Chevy';
	const sql = 'DROP TABLE IF EXISTS cool_cars';

	const values = [
		['GT86', 'Toyota'],
		['SFX', 'Scion'],
	];
	con.query(sql, function(err, result, fields) {
		if (err) throw err;
		console.log(result.warning);
	});
});