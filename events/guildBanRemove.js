require('dotenv').config();
const { MessageEmbed } = require('discord.js');
const findLog = require('../database/findLog.js');

module.exports = {
	name: 'guildBanRemove',
	async execute(ban) {
		try {
			const logType = 'memberLog';
			const user = ban.user;
			const guild = ban.guild;
			const fetchedLogs = await guild.fetchAuditLogs({ limit: 1, type: 'MEMBER_BAN_REMOVE' });
			const executor = fetchedLogs.entries.first().executor;
			//const executor = banLog.executor;
			

			const embed = new MessageEmbed()
				.setColor(process.env.color)
				.setTitle('User unbanned')
				.setThumbnail(user.avatarURL({ DYNAMIC: true }))
				.setDescription(`<@${user.id}>`)
				.addField('Unbanned by', `<@${executor.id}>`, true)
				.setTimestamp()
				.setFooter('Made with 🖤 by Suzan');

			console.log(`'${executor.tag}' unbanned '${user.tag}' from '${guild.name}'`);

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