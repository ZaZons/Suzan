require('dotenv').config();
const { MessageEmbed } = require('discord.js');
const findLog = require('../database/findLog.js');
const checkModFile = require('../database/checkMod.js');
const checkBanned = require('../database/checkBannedMySQL.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('goodbye-channel')
		.setDescription('Sets a channel as your goodbye channel, when someone leaves the server a message will be sent there')
		.addChannelOption(option =>
			option.setName('channel')
				.setDescription('Goodbye channel')
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

			const goodbyeChannel = interaction.options.getChannel('channel');
			if (goodbyeChannel.type !== 'GUILD_TEXT') {
				await interaction.reply('Please try again and select a text channel');
				return;
			}

			const guild = interaction.guild;
			const connection = await require('../../database/db.js');
			const sql = `UPDATE guilds SET goodbyeChannel = '${goodbyeChannel.id}' WHERE guilds.id = '${guild.id}'`;
			connection.query(sql).catch(console.log);

			const embed = new MessageEmbed()
				.setColor(process.env.color)
				.setTitle('Goodbye channel updated')
				.setThumbnail(interaction.user.avatarURL({ DYNAMIC: true }))
				.setDescription(`<#${goodbyeChannel.id}>`)
				.addFields(
					{ name: 'Channel category', value: goodbyeChannel.parent.name, inline: true },
					{ name: 'Updated by', value: `<@${interaction.user.id}>`, inline: true },
				)
				.setTimestamp()
				.setFooter('made with 🖤 by Suzan');

			console.log(`'${guild.name}' has now '#${goodbyeChannel.name}' as the goodbye channel.`);

			const logType = 'channelLog';
			const channelLog = await findLog.findLog(guild, logType);
			if (channelLog) {
				await channelLog.send({ embeds: [embed] });
			} else {
				const generalLog = await findLog.findLog(guild, 'generalLog');
				if (generalLog) await generalLog.send({ embeds: [embed] });
			}

			await interaction.reply('Goodbye channel updated successfully');
		} catch (error) {
			console.log(error);
		}
	},
};