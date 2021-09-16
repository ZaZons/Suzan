const { MessageEmbed } = require('discord.js');
const { logChannelTopic } = require('../config.json');

module.exports = {
	name: 'messageDelete',
	async execute(message)
	{
		if (!message.guild) return;
		const guild = message.guild;
		const channels = guild.channels.cache;
		const logChannel = channels.find(c => c.topic === logChannelTopic);
		if (message.channel === logChannel) return;
		const fetchedLogs = await guild.fetchAuditLogs({ limit: 1, type: 'MESSAGE_DELETE' });
		const deleteLogs = fetchedLogs.entries.first();
		const { executor, target } = deleteLogs;
		const embed = new MessageEmbed()
			.setColor('#00FFE9')
			.setAuthor(executor.tag, executor.avatarURL())
			.setTitle('Message deleted')
			.addFields(
				{ name: 'Channel', value: `<#${message.channelId}>`, inline: true },
				{ name: 'Category', value: `${message.channel.parent.name}`, inline: true },
			)
			.setTimestamp();

		if (!message.partial && message.content !== '')
		{
			embed.setDescription(`'${message.content}'`)
				.addField('Message Author', `<@${message.author.id}>`);
		}

		if (logChannel) await logChannel.send({ embeds: [embed] });
		console.log(`'${executor.tag}' deleted a message from '${target.tag}' in '#${message.channel.name}>' at '${guild.name}'`);
	},
};