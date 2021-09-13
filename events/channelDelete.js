const { MessageEmbed } = require('discord.js');
const { logChannelTopic } = require('../config.json');

module.exports = {
	name: 'channelDelete',
	async execute(channel) {
		if (!channel.guild) return;
		const guild = channel.guild;
		const channels = guild.channels.cache;
		const logChannel = channels.find(c => c.topic === logChannelTopic);
		const AuditLogFetch = await guild.fetchAuditLogs({ limit: 1, type: 'CHANNEL_DELETE' });
		const createdLog = AuditLogFetch.entries.first();
		const deleter = createdLog.executor;
		const embed = new MessageEmbed()
			.setColor('#00FFE9')
			.setTitle('Channel deleted')
			.setThumbnail(deleter.avatarURL({ dynamic: true }))
			.setDescription(`#${channel.name}`)
			.setFields(
				{ name: 'Channel ID', value: channel.id, inline: true },
				{ name: 'Deleted by', value: `<@${deleter.id}>`, inline: true },
			)
			.setTimestamp()
			.setFooter('made with 🖤 by Suzan');
		if (logChannel) {
			await logChannel.send({ embeds: [embed] });
		}
		console.log(`Channel '#${channel.name}' was deleted at '${guild.name}' by '${deleter.tag}'.`);
	},
};