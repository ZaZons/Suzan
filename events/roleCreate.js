const { MessageEmbed } = require('discord.js');
const { logChannelTopic } = require('../config.json');

module.exports = {
	name: 'roleCreate',
	async execute(role)
	{
		if (!role.guild) return;
		const guild = role.guild;
		const channels = guild.channels.cache;
		const logChannel = channels.find(c => c.topic === logChannelTopic);
		const fetchedLogs = await guild.fetchAuditLogs({ limit: 1, type: 'ROLE_CREATE' });
		const createLog = fetchedLogs.entries.first();
		const executor = createLog.executor;

		const embed = new MessageEmbed()
			.setColor('#00FFE9')
			.setAuthor(executor.tag, executor.avatarURL())
			.setTitle('Role created')
			.setDescription(`<@&${role.id}>`)
			.setTimestamp();

		if (logChannel) logChannel.send({ embeds: [embed] });
		console.log(`'${executor.tag}' created the role '${role.name}' at '${guild.name}'`);
	},
};