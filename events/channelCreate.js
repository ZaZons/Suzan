const { MessageEmbed } = require('discord.js');
const { logChannelTopic } = require('../config.json');

module.exports = {
	name: 'channelCreate',
	async execute(channel) {
		if (!channel.guild) return;
		const guild = channel.guild;
		const channels = guild.channels.cache;
		const logChannel = channels.find(c => c.topic === logChannelTopic);
		const fetchedLogs = await guild.fetchAuditLogs({ limit: 1, type: 'CHANNEL_CREATE' });
		const createdLog = fetchedLogs.entries.first();
		const creator = createdLog.executor;
		const embed = new MessageEmbed()
			.setColor('#00FFE9')
			.setTitle('Channel created')
			.setThumbnail(creator.avatarURL({ dynamic: true }))
			.setDescription(`<#${channel.id}>`)
			.addFields(
				{ name: 'Channel ID', value: channel.id, inline: true },
				{ name: 'Created by', value: `<@${creator.id}>`, inline: true },
			)
			.setTimestamp()
			.setFooter('made with 🖤 by Suzan');
		if (logChannel) {
			await logChannel.send({ embeds: [embed] });
		}
		console.log(`Channel '#${channel.name}' was created at '${guild.name}' by '${creator.tag}'.`);
	},
};