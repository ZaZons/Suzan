require('dotenv').config();
const { MessageEmbed } = require('discord.js');
const findLog = require('../database/findLog.js');

module.exports = {
	name: 'channelDelete',
	async execute(channel) {
		try {
			if (!channel.guild) return;
			const logType = 'channelLog';
			const guild = channel.guild;
			const fetchedLogs = await guild.fetchAuditLogs({ limit: 1, type: 'CHANNEL_DELETE' });
			const deleter = fetchedLogs.entries.first().executor;
			//const deleter = createdLog.executor;

			const embed = new MessageEmbed()
				.setColor(process.env.color)
				.setTitle('Channel deleted')
				.setThumbnail(deleter.avatarURL({ dynamic: true }))
				.setDescription(`#${channel.name}`)
				.setFields(
					{ name: 'Channel category', value: `<#${channel.parentId}>`, inline: true },
					{ name: 'Deleted by', value: `<@${deleter.id}>`, inline: true },
				)
				.setTimestamp()
				.setFooter('made with 🖤 by Suzan');

			console.log(`Channel '#${channel.name}' was deleted at '${guild.name}' by '${deleter.tag}'.`);

			const channelLog = await findLog.findLog(guild, logType);
			if (channelLog) {
				await channelLog.send({ embeds: [embed] });
			} else {
				const generalLog = await findLog.findLog(guild, 'generalLog');
				if (generalLog) await generalLog.send({ embeds: [embed] });
			}
		} catch (error) {
			console.log(error);
		}
	},
};