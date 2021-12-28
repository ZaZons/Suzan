require('dotenv').config();
const checkBanned = require('../database/checkBannedmySQL.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('check-banned')
		.setDescription('Checks if a user is banned')
		.addUserOption(option =>
			option.setName('member')
				.setDescription('User that may, or may not be banned')
				.setRequired(true)),
				
	async execute(interaction) {
		const user = interaction.options.getMember('member');
		const banned = await checkBanned.checkBannedUser(user);
		
		if (banned) {
			await interaction.reply('The user is blocked');
		} else {
			await interaction.reply('The user is not blocked (Love you <3)');
		}
	},
};