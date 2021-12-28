require('dotenv').config();
const { MessageEmbed } = require('discord.js');
const findLog = require('../database/findLog.js');

module.exports = {
  name: 'channelCreate',
	async execute(channel) {
		try {
			if (!channel.guild) return;
			const logType = 'channelLog';
			const guild = channel.guild;
			const fetchedLogs = await guild.fetchAuditLogs({ limit: 1, type: 'CHANNEL_CREATE' });
			const creator = fetchedLogs.entries.first().executor;
			//const creator = createdLog.executor;

			const embed = new MessageEmbed()
				.setColor(process.env.color)
				.setTitle('Channel created')
				.setThumbnail(creator.avatarURL({ dynamic: true }))
				.setDescription(`#${channel.name}`)
				.addFields(
					{ name: 'Channel category', value: channel.parent.name, inline: true },
					{ name: 'Created by', value: `<@${creator.id}>`, inline: true },
				)
				.setTimestamp()
				.setFooter('made with 🖤 by Suzan');

			console.log(`Channel '#${channel.name}' was created at '${guild.name}' by '${creator.tag}'.`);

			const channelLog = await findLog.findLog(guild, logType);
			if (channelLog) {
				await channelLog.send({ embeds: [embed] });
			} else {
				const generalLog = await findLog.findLog(guild, 'generalLog');
				if (generalLog) await generalLog.send({ embeds: [embed] });
			}
		} catch (err) {
			console.log(err);
		}
	},
};