require('dotenv').config();
const { MessageEmbed } = require('discord.js');
const checkBanned = require('../database/checkBannedMySQL.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('set-timezone')
		.setDescription('Sets your timezone')
		.addStringOption(option => 
			option.setName('timezone')
				.setDescription('Input your timezone')
				.setRequired(true)),

	async execute(interaction) {
		try {
			const banned = await checkBanned.checkBannedUser(interaction.member);
			if (banned) {
				await interaction.reply('You can\'t use this bot, you\'re blocked');
				return;
			}

			const user = interaction.user;
			const timezone = interaction.options.getString('timezone');
			let isMemberInDatabase = false;
			const connection = await require('../database/db.js');
			const sql = `SELECT * FROM users WHERE id = '${user.id}'`;
			await connection.query(sql).then(result => {
				if (result[0][0]) isMemberInDatabase = true;
			}).catch(console.log);

			if (isMemberInDatabase) {
				const sql1 = `UPDATE users SET timezone = '${timezone}' WHERE users.id = '${user.id}'`;
				await connection.query(sql1).catch(console.log);
			} else {
				const sql1 = `INSERT INTO users VALUES ('${user.id}', '${user.tag}', '${timezone}')`;
				await connection.query(sql1).catch(console.log);
			}

			await interaction.reply('Timezone updated successfully');
		} catch (error) {
			console.log(error);
		}
	},
};