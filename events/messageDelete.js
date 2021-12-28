require('dotenv').config();
const { MessageEmbed } = require('discord.js');
const findLog = require('../database/findLog.js');

module.exports = {
	name: 'messageDelete',
	async execute(message) {
		try {
			if (!message.guild) return;
			const logType = 'messageLog';
			const guild = message.guild;
			const channelLog = await findLog.findLog(guild, logType);
			const generalLog = await findLog.findLog(guild, 'generalLog');
			if (message.channel === channelLog) return;
			if (message.channel === generalLog) return;
			const fetchedLogs = await guild.fetchAuditLogs({ limit: 1, type: 'MESSAGE_DELETE' });
			const executor = fetchedLogs.entries.first().executor;
			//const { executor } = deleteLogs;

			const embed = new MessageEmbed()
				.setColor(process.env.color)
				.setTitle('Message deleted')
				.setDescription(`<#${message.channelId}>`)
				.setThumbnail(executor.avatarURL({ dynamic: true }))
				.setTimestamp()
				.setFooter('made with 🖤 by Suzan');

			if (!message.partial && message.content !== '') {
				if(message.content !== '') {
					embed.addField('Message content', message.content);
				}
				embed.addFields(
					{ name: 'Message author', value: `<@${message.author.id}>`, inline: true },
					{ name: 'Deleted by', value: `<@${executor.id}>`, inline: true },
				);
			} 

			console.log(`'${executor.tag}' deleted a message in '#${message.channel.name}' at '${guild.name}'`);

			if (channelLog) {
				await channelLog.send({ embeds: [embed] });
			} else {
				if (generalLog) await generalLog.send({ embeds: [embed] });
			}
		} catch (error) {
			console.log(error);
		}
	},
};