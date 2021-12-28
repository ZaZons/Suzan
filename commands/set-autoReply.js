require('dotenv').config(); 
const checkModFile = require('../database/checkMod.js');
const { MessageEmbed } = require('discord.js');
const checkBanned = require('../database/checkBannedMySQL.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const findLog = require('../database/findLog.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('set-autoreply')
		.setDescription('Setsa a trigger and an auto reply')
		.addStringOption(option =>
			option.setName('trigger')
				.setDescription('Input a trigger')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('reply')
				.setDescription('Input the reply')
				.setRequired(true)),

	async execute(interaction) {
		try {
			const banned = await checkBanned.checkBannedUser(interaction.member);
			if (banned) {
				await interaction.reply('You can\'t use this bot, you\'re blocked');
				return;
			}

			const connection = await require('../database/db.js');
			const isMod = await checkModFile.checkMod(interaction.member);
			if (!isMod) {
				await interaction.reply('You\'re not a mod, so you can\'t use this command');
				return;
			}

			const trigger = interaction.options.getString('trigger');
			const reply= interaction.options.getString('reply');
			const sql = `INSERT INTO auto_reply (trigger, reply, guildId) VALUES ('${trigger}', '${reply}', '${interaction.guildId}')`;
			await connection.query(sql).catch(console.log);

			await interaction.reply('Auto reply added successfully');
		} catch (error) {
			console.log(error);
		}
	},
};