const { MessageEmbed } = require('discord.js');
const { logChannelTopic } = require('../config.json');

module.exports = {
	name: 'messageUpdate',
	async execute(oldMessage, newMessage) {
		if (!newMessage.guild) return;
		const guild = newMessage.guild;
		const channels = guild.channels.cache;
		const logChannel = channels.find(c => c.topic === logChannelTopic);
		const fetchedLogs = await guild.fetchAuditLogs({ limit: 1, type: 'MESSAGE_UPDATE' });
		const updateLog = fetchedLogs.entries.first();
		const executor = updateLog.executor;
		const embed = new MessageEmbed();
		if (oldMessage.content !== newMessage.content) {
			embed.setColor('#00FFE9')
				.setTitle('Message edited')
				.setThumbnail(executor.avatarURL({ dynamic: true }))
				.setDescription(`<#${newMessage.channelId}>`)
				.addField('Sent by', `<@${executor.id}>`)
				.setTimestamp()
				.setFooter('made with 🖤 by Suzan');
			if (!oldMessage.partial) {
				embed.addFields(
					{ name: 'Old content', value: oldMessage.content, inline: true },
					{ name: 'New content', value: newMessage.content, inline: true },
				);
			}
			if (logChannel) {
				await logChannel.send({ embeds: [embed] });
				console.log(`'${executor.tag}' edited a message in '${newMessage.channel.name}' at '${guild.name}'`);
			}
		}
	},
};