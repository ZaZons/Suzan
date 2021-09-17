const { logChannelTopic } = require('../config.json');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
	name: 'messageDeleteBulk',
	async execute(messages)
	{
		if (!messages.guild) return;
		const guild = messages.guild;
		const channels = guild.channels.cache;
		const logChannel = channels.find(c => c.topic === logChannelTopic);
		if (messages.channel === logChannel) return;
		const fetchedLogs = await guild.fetchAuditLogs({ limit: 1, type: 'MESSAGE_BULK_DELETE' });
		const deleteLogs = fetchedLogs.entries.first();
		const executor = deleteLogs.executor;

		const embed = new MessageEmbed()
			.setColor('#00FFE9')
			.setAuthor(executor.tag, executor.avatarURL())
			.setTitle(`Deleted ${messages.size} messages`)
			.setDescription('Press the button *Full Log* to get a file with the entire log of messages deleted')
			.setTimestamp();

		const button = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setLabel('Full log')
					.setStyle('LINK'),
			);

		console.log(`'${executor.tag}' bulk deleted from '${guild.name}'`);
		if (logChannel) await logChannel.send({ embeds: [embed], components: [button] });
	},
};