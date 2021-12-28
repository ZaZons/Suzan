require('dotenv').config();
const moment = require('moment-timezone');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'messageReactionAdd',
	async execute(messageReaction, user) {
		try {
			/* if(user.bot) return;
			if (messageReaction.emoji.name === '🌐') {
				const content = messageReaction.message.content;
				const regex = /\b([0-1][0-9]|2[0-3]):([0-5][0-9])/g;
				const regex2 = /\b([0-9]|1[0-2]):([0-5][0-9])\b/g;
				const found = content.match(regex);
				const found2 = content.match(regex2);
				let oldTime, newTime, oldTimezone, newTimezone;

				if (found) {
					const connection = await require('../database/db.js');
					const sql = `SELECT timezone FROM users WHERE id = '${messageReaction.message.author.id}'`;
					await connection.query(sql).then(result => {
						if (result[0][0].timezone) oldTimezone = result[0][0].timezone;
					}).catch(console.log);

					const sql1 = `SELECT timezone FROM users WHERE id = '${user.id}'`;
					await connection.query(sql1).then(result => {
						if (result[0][0].timezone) newTimezone = result[0][0].timezone;
					}).catch(console.log);

					const givenTime = moment(found, 'hh:mm').format();
					oldTime = moment.tz(givenTime, oldTimezone).format('HH:mm');
					newTime = moment.tz(givenTime, newTimezone).format('HH:mm');
				} else if (found2) {
					const connection = await require('../database/db.js');
					const sql = `SELECT timezone FROM users WHERE id = '${messageReaction.message.author.id}'`;
					await connection.query(sql).then(result => {
						if (result[0][0].timezone) oldTimezone = result[0][0].timezone;
					}).catch(console.log);
					
					const sql1 = `SELECT timezone FROM users WHERE id = '${user.id}'`;
					await connection.query(sql1).then(result => {
						if(result[0][0].timezone) newTimezone = result[0][0].timezone;
					}).catch(console.log);

					const givenTime = moment(found2, 'h:mm').format();
					oldTime = moment.tz(givenTime, oldTimezone).format('HH:mm');
					newTime = moment.tz(givenTime, newTimezone).format('HH:mm');
				}
				if (oldTime && newTime) {
					const embed = new MessageEmbed()
						.setColor(process.env.color)
						.setTitle('Time conversion')
						.setDescription(`${oldTimezone} ► ${newTimezone}`)
						.addField(`${oldTime} ► ${newTime}`, '\u200b')
						.setTimestamp()
						.setFooter('Made with 🖤 by Suzan');
					user.send({embeds: [embed]});
				}
			} */
		} catch (error) {
			console.log(error);
		}
	},
};