require('dotenv').config();
const { MessageEmbed } = require('discord.js');
const findLog = require('../database/findLog.js');

module.exports = {
	name: 'messageDeleteBulk',
	async execute(messages) {
		try {
			if (!messages.guild) return;
			const logType = 'messageLog';
			const guild = messages.guild;
			const channelLog = await findLog.findLog(guild, logType);
			const generalLog = await findLog.findLog(guild, 'generalLog');
			if (message.channel === channelLog) return;
			if (message.channel === generalLog) return;
			const fetchedLogs = await guild.fetchAuditLogs({ limit: 1, type: 'MESSAGE_BULK_DELETE' });
			const executor = fetchedLogs.entries.first().executor;
			//const executor = deleteLogs.executor;

			const embed = new MessageEmbed()
				.setColor(process.env.color)
				.setTitle('Messages bulk deleted')
				.setDescription(`<#${messages.channelId}>`)
				.setThumbnail(executor.avatarURL({ dynamic: true }))
				.addField('Deleted by', `<@${executor.id}>`)
				.setTimestamp()
				.setFooter('made with 🖤 by Suzan');

			console.log(`'${executor.tag}' bulk deleted from '${guild.name}'`);

			if (channelLog) {
				await channelLog.send({ embeds: [embed] });
			} else {
				if (generalLog) await generalLog.send({ embeds: [embed] });
			}
		} catch (error) {
			console.log(error);
		}
	},
};