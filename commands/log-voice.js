require('dotenv').config();
const checkBanned = require('../database/checkBannedMySQL.js');
const { MessageEmbed } = require('discord.js');
const checkModFile = require('../database/checkMod.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const findLog = require('../database/findLog.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('log-voice')
		.setDescription('Selects a channel as your voice log, voice related logs will be sent there')
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

			const connection = await require('../database/db.js');
			const isMod = await checkModFile.checkMod(interaction.member);
			if (!isMod) {
				await interaction.reply('You\'re not a mod, so you can\'t use this command');
				return;
			}

			const logType = 'channelLog';			
			const logChannel = interaction.options.getChannel('channel');
			if (logChannel.type !== 'GUILD_TEXT') {
				await interaction.reply('Please try again and select a text channel');
				return;
			}
			const sql = `UPDATE guilds SET voiceLog = '${logChannel.id}' WHERE guilds.id = '${interaction.guild.id}'`;
			connection.query(sql).catch(console.log);

			const embed = new MessageEmbed()
				.setColor(process.env.color)
				.setTitle('Voice log updated')
				.setThumbnail(interaction.user.avatarURL({ DYNAMIC: true }))
				.setDescription(`<#${logChannel.id}>`)
				.addFields(
					{ name: 'Channel category', value: logChannel.parent.name, inline: true },
					{ name: 'Updated by', value: `<@${interaction.user.id}>`, inline: true },
				)
				.setTimestamp()
				.setFooter('made with 🖤 by Suzan');

			await interaction.reply('Log channel updated successfully');
			await logChannel.send('Hi, this is your new voice log');

			const channelLog = await findLog.findLog(interaction.guild, logType);
			if (channelLog) {
				await channelLog.send({ embeds: [embed] });
			} else {
				const generalLog = await findLog.findLog(interaction.guild, 'generalLog');
				if (generalLog) await generalLog.send({ embeds: [embed] });
			}
		} catch (err) {
			console.log(err);
		}
	}
};