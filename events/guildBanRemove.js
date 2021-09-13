const { MessageEmbed } = require('discord.js');
const { logChannelTopic } = require('../config.json');

module.exports = {
	name: 'guildBanRemove',
	async execute(ban) {
		const user = ban.user;
		const guild = ban.guild;
		const channels = guild.channels.cache;
		const logChannel = channels.find(c => c.topic === logChannelTopic);
		const fetchedLogs = await guild.fetchAuditLogs({ limit: 1, type: 'MEMBER_BAN_REMOVE' });
		const banLog = fetchedLogs.entries.first();
		const executor = banLog.executor;
		const embed = new MessageEmbed()
			.setColor('#00FFE9')
			.setTitle('User unbanned')
			.setThumbnail(user.avatarURL({ DYNAMIC: true }))
			.setDescription(`<@${user.id}>`)
			.addField('Unbanned by', `<@${executor.id}>`, true)
			.setTimestamp()
			.setFooter('Made with 🖤 by Suzan');
		console.log(`'${executor.tag}' unbanned '${user.tag}' from '${guild.name}'`);
		if (logChannel) {
			await logChannel.send({ embeds: [embed] });
		}
	},
};