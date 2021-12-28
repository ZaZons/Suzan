module.exports = {
	async findLog(guild, logType) {
		try {
			const connection = await require('./db.js');
			let log = null;
			const sql2 = `SELECT ${logType} FROM guilds WHERE id = '${guild.id}'`;
			await connection.query(sql2).then(result => {
				if (result[0][0]) log = guild.channels.cache.find(c => c.id === Object.values(result[0][0])[0]);
			}).catch(console.log);
			return log;
		} catch (err) {
			console.log(err);
		}
	},
};