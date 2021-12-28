require('dotenv').config();
const checkModFile = require('../database/checkMod.js');
const checkBanned = require('../database/checkBannedMySQL.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mod-role')
		.setDescription('Selects a role as your mod role, so they can use privileged commands')
		.addRoleOption(option =>
			option.setName('mod-role')
				.setDescription('Select role')
				.setRequired(true)),

	async execute(interaction) {
		try {
			const banned = await checkBanned.checkBannedUser(interaction.member);
			if (banned) {
				await interaction.reply('You can\'t use this bot, you\'re blocked');
				return;
			}

			const isMod = await checkModFile.checkMod(interaction.member);
			if (!isMod) {
				await interaction.reply('You\'re not a mod, so you can\'t use this command');
				return;
			}

			const newModRole = interaction.options.getRole('mod-role');
			const connection = await require('../database/db.js');
			const setModRole = `INSERT INTO mod_roles VALUES ('${newModRole.id}', '${newModRole.name}', '${interaction.guild.id}')`;
			await connection.query(setModRole).then(() => {
				console.log(`Mod role updated in ${interaction.guild.name}`);
			});
 
			await interaction.reply('Mod role updated successfully');
		} catch (err) {
			console.log(err);
		}
	}
};