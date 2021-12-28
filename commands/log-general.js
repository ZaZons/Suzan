require('dotenv').config();
const checkBanned = require('../database/checkBannedMySQL.js');
const { MessageEmbed } = require('discord.js');
const checkModFile = require('../database/checkMod.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('log-general')
		.setDescription('Selects a channel as your general log, all non-specific logs will be sent there')
		.addChannelOption(option =>
			option.setName('channel')
				.setDescription('Select channel')
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
			
			const logChannel = interaction.options.getChannel('channel');
			if(logChannel.type !== 'GUILD_TEXT') {
				await interaction.reply('Please try again and select a text channel');
				return;
			}

			const connection = await require('../database/db.js');
			const sql = `UPDATE guilds SET generalLog = '${logChannel.id}' WHERE guilds.id = '${interaction.guild.id}'`;
			await connection.query(sql).catch(console.log);

			const embed = new MessageEmbed()
				.setColor(process.env.color)
				.setTitle('General log updated')
				.setThumbnail(interaction.user.avatarURL({ DYNAMIC: true }))
				.setDescription(`<#${logChannel.id}>`)
				.addFields(
					{ name: 'Channel category', value: logChannel.parent.name, inline: true },
					{ name: 'Updated by', value: `<@${interaction.user.id}>`, inline: true },
				)
				.setTimestamp()
				.setFooter('made with 🖤 by Suzan');

			await interaction.reply('Log channel updated successfully');
			await logChannel.send('Hi, this is your new general log');
			await logChannel.send({embeds: [embed]});
		} catch (err) {
			console.log(err);
		}
	}
};