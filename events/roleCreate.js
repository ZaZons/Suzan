require('dotenv').config();
const { MessageEmbed } = require('discord.js');
const findLog = require('../database/findLog.js');

module.exports = {
	name: 'roleCreate',
	async execute(role) {
		try {
			if (!role.guild) return;
			const logType = 'roleLog';
			const guild = role.guild;
			const fetchedLogs = await guild.fetchAuditLogs({ limit: 1, type: 'ROLE_CREATE' });
			const createLog = fetchedLogs.entries.first().executor;
			//const executor = createLog.executor;

			const embed = new MessageEmbed()
				.setColor(process.env.color)
				.setTitle('Role created')
				.setThumbnail(executor.avatarURL({ dynamic: true }))
				.setDescription(`${role.name}`)
				.addFields('Role ID', role.id)
				.setTimestamp()
				.setFooter('made with 🖤 by Suzan');

			console.log(`'${executor.tag}' created the role '${role.name}' at '${guild.name}'`);

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