const { MessageEmbed } = require('discord.js');
const { logChannelTopic } = require('../config.json');

module.exports = {
	name: 'roleDelete',
	async execute(role) {
		if (!role.guild) return;
		const guild = role.guild;
		const channels = guild.channels.cache;
		const logChannel = channels.find(c => c.topic === logChannelTopic);
		const fetchedLogs = await guild.fetchAuditLogs({ limit: 1, type: 'ROLE_DELETE' });
		const createLog = fetchedLogs.entries.first();
		const executor = createLog.executor;
		const embed = new MessageEmbed()
			.setColor('#00FFE9')
			.setTitle('Role deleted')
			.setThumbnail(executor.avatarURL({ dynamic: true }))
			.setDescription(`${role.name}`)
			.addFields(
				{ name: 'Role ID', value: role.id, inline: true },
				{ name: 'Deleted by', value: `<@${executor.id}>`, inline: true },
			)
			.setTimestamp()
			.setFooter('made with 🖤 by Suzan');
		if (logChannel) logChannel.send({ embeds: [embed] });
		console.log(`'${executor.tag}' deleted the role '${role.name}' at '${guild.name}'`);
	},
};