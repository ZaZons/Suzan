require('dotenv').config();
const { MessageEmbed } = require('discord.js');
const findLog = require('../database/findLog.js');

module.exports = {
	name: 'guildBanAdd',
	async execute(ban) {
		try {
			const logType = 'memberLog';
			const user = ban.user;
			const guild = ban.guild;
			const fetchedLogs = await guild.fetchAuditLogs({ limit: 1, type: 'MEMBER_BAN_ADD' });
			const banLog = fetchedLogs.entries.first();
			const executor = banLog.executor;
			const reason = banLog.reason;

			const embed = new MessageEmbed()
				.setColor(process.env.color)
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

			const channelLog = await findLog.findLog(guild, logType);
			if (channelLog) {
				await channelLog.send({ embeds: [embed] });
			} else {
				const generalLog = await findLog.findLog(guild, 'generalLog');
				if (generalLog) await generalLog.send({ embeds: [embed] });
			}
		} catch (error) {
			console.log(error);
		}
	},
};