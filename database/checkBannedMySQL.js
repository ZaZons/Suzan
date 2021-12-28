module.exports = {
	async checkBannedUser(member) {
		try {
			if (member.id === member.guild.ownerId) return false;
			const connection = await require('../database/db.js');
			const sql = `SELECT * FROM blocked_users WHERE id = '${member.id}'`;
			let isBanned = false;

			await connection.query(sql).then(result => {
				if (result[0][0]) isBanned = result[0][0].id === member.id ? true : false;
			}).catch(console.log);

			return isBanned;
		} catch (err) {
			console.log(err);
		}
	},
};