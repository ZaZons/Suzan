require('dotenv').config();
const random = require('random');

module.exports = {
	name: 'messageCreate',
	async execute(message) {
		try {
			if (message.author.bot) return;
			const content = message.content;
			const connection = await require('../database/db.js');
			const sql = `SELECT * FROM auto_reply WHERE guildId = '${message.guild.id}'`;
			await connection.query(sql).then(result => {
				if (!result[0][0]) return;
				if (content !== result[0][0].trigger) return;
				message.reply(result[0][0].reply);
			}).catch(console.log);
			
			const user = message.author;
			const guild = message.guild;
			const sql1 = `SELECT * FROM levels WHERE userId = '${user.id}' AND guildId = '${guild.id}'`
			await connection.query(sql1).then(result => {
				if (!result[0][0]) {
					const sql2 = `INSERT INTO levels (userId, guildId) VALUES ('${user.id}', '${guild.id}')`;
					connection.query(sql2).catch(console.log);
				} else {
					let xp = result[0][0].xp;
					let level = result[0][0].level;
					const nextLevel = 5 * Math.pow(level, 2) + 50 * level + 100;
					xp += random.int(15, 25);
					const sql2 = `UPDATE levels SET xp = '${xp}' WHERE userId = '${user.id}' AND guildId = '${guild.id}'`;
					connection.query(sql2).catch(console.log);
					if (xp >= nextLevel) {
						level++;
						xp = xp - nextLevel;
						message.channel.send(`<@${user.id}> has reached level ${level}`);
						const sql3 = `UPDATE levels SET xp = '${xp}', level = '${level}' WHERE userId = '${user.id}' AND guildId = '${guild.id}'`;
						connection.query(sql3).catch(console.log);
					}
				}
			})
		} catch (error) {
			console.log(error);
		}
	},
};