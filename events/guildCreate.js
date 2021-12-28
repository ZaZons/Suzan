module.exports = {
	name: 'guildCreate',
	async execute(guild) {
		try {
			const connection = await require('../database/db.js');
			let alreadyAdded = false;

			const selectSQL = `SELECT * FROM guilds WHERE id = '${guild.id}';`;
			await connection.query(selectSQL).then(result => {
				alreadyAdded = result[0][0] ? true : false
			}).catch(err => console.log(err));

			if(!alreadyAdded) {
				const insertSQL = `INSERT INTO guilds (id, name) VALUES ('${guild.id}', '${guild.name}');`
				await connection.query(insertSQL).then(() => 
					console.log('Guild inserted in database')
				).catch(err => console.log(err));
			} else {
				console.log('Guild already inserted in database');
			}

			console.log(`Joined '${guild.name}'`);
		} catch (err) {
			console.log(err);
		}
	},
};