const { MessageEmbed } = require('discord.js');
const { logChannelTopic } = require('../config.json');

module.exports = {
	name: 'messageDelete',
	async execute(message) {
		if (!message.guild) return;
		const guild = message.guild;
		const channels = guild.channels.cache;
		const logChannel = channels.find(c => c.topic === logChannelTopic);
		const fetchedLogs = await guild.fetchAuditLogs({ limit: 1, type: 'MESSAGE_DELETE' });
		const deleteLogs = fetchedLogs.entries.first();
		if (!deleteLogs) return console.log('n encontramos nada nos logs lol');
		const executor = deleteLogs.executor;
		const target = deleteLogs.target;
		const embed = new MessageEmbed()
			.setColor('#00FFE9')
			.setTitle('Message deleted')
			.setDescription(`<#${message.channelId}>`)
			.setThumbnail(executor.avatarURL({ dynamic: true }))
			.addFields(
				{ name: 'Message author', value: `<@${target.id}>`, inline: true },
				{ name: 'Deleted by', value: `<@${executor.id}>`, inline: true },
			)
			.setTimestamp()
			.setFooter('made with 🖤 by Suzan');
		if (!message.partial && message.content !== '') {
			embed.addField('Message content', message.content);
		}
		if (logChannel) {
			await logChannel.send({ embeds: [embed] });
		}
		console.log(`'${executor.tag}' deleted a message from '${target.tag}' in '#${message.channel.name}>' at '${guild.name}'`);
	},
};