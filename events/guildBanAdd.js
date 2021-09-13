const { MessageEmbed } = require('discord.js');
const { logChannelTopic } = require('../config.json');

module.exports = {
	name: 'guildBanAdd',
	async execute(ban) {
		const user = ban.user;
		const guild = ban.guild;
		const channels = guild.channels.cache;
		const logChannel = channels.find(c => c.topic === logChannelTopic);
		const fetchedLogs = await guild.fetchAuditLogs({ limit: 1, type: 'MEMBER_BAN_ADD' });
		const banLog = fetchedLogs.entries.first();
		const executor = banLog.executor;
		const reason = banLog.reason;
		const embed = new MessageEmbed()
			.setColor('#00FFE9')
			.setTitle('User banned')
			.setThumbnail(user.avatarURL({ DYNAMIC: true }))
			.setDescription(`<@${user.id}>`)
			.addField('Banned by', `<@${executor.id}>`, true)
			.setTimestamp()
			.setFooter('Made with 🖤 by Suzan');
		if (reason) {
			embed.addField('Reason', reason, true);
			console.log(`'${executor.tag}' banned '${user.tag}' from '${guild.name}' because '${reason}'`);
		}
		if (logChannel) {
			await logChannel.send({ embeds: [embed] });
		}
	},
};