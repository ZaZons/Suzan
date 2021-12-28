require('dotenv').config();
const moment = require('moment-timezone');
const checkBanned = require('../database/checkBannedMySQL.js');
const { Client, ContextMenuInteraction } = require('discord.js');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: {
		name: 'convert-time',
		type: '3',
	},

	async execute(interaction) {
		try {
			const message = await interaction.channel.messages.fetch(interaction.targetId);
			const content = message.content;
			const regex = /\b([0-1][0-9]|2[0-3]):([0-5][0-9])/g;
			const regex2 = /\b([0-9]|1[0-2]):([0-5][0-9])\b/g;
			const found = content.match(regex);
			const found2 = content.match(regex2);
			const user = interaction.user;
			let oldTime, newTime, oldTimezone, newTimezone;

			if (found) {
				const connection = await require('../database/db.js');
				const sql = `SELECT timezone FROM users WHERE id = '${message.author.id}'`;
				await connection.query(sql).then(result => {
					if (result[0][0].timezone) oldTimezone = result[0][0].timezone;
				}).catch(console.log);

				const sql1 = `SELECT timezone FROM users WHERE id = '${user.id}'`;
				await connection.query(sql1).then(result => {
					if (result[0][0].timezone) newTimezone = result[0][0].timezone;
				}).catch(console.log);

				const givenTime = moment.tz(found, 'hh:mm', oldTimezone).format();
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
					if (result[0][0].timezone) newTimezone = result[0][0].timezone;
				}).catch(console.log);

				const givenTime = moment(found2, 'h:mm').format();
				oldTime = moment.tz(givenTime, oldTimezone).format('HH:mm');
				console.log(oldTime);
				newTime = moment.tz(givenTime, newTimezone).format('HH:mm');
				console.log(newTime);
			} else {
				interaction.reply({ content: 'This message does not contain an hour format, select a message with one and try again', ephemeral: true });
			}
			if (oldTime && newTime) {
				const embed = new MessageEmbed()
					.setColor(process.env.color)
					.setTitle('Time conversion')
					.setDescription(`${oldTimezone} ► ${newTimezone}`)
					.addField(`${oldTime} ► ${newTime}`, '\u200b')
					.setTimestamp()
					.setFooter('Made with 🖤 by Suzan');
				interaction.reply({ embeds: [embed], ephemeral: true });
			}
		} catch (error) {
			console.log(error);
		}
	},
};