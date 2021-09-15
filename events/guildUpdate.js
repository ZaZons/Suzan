const { MessageEmbed } = require('discord.js');
const { logChannelTopic } = require('../config.json');

module.exports = {
	name: 'guildUpdate',
	async execute(oldGuild, newGuild) {
		const guild = newGuild;
		const channels = guild.channels.cache;
		const logChannel = channels.find(c => c.topic === logChannelTopic);
		const fetchedLogs = await guild.fetchAuditLogs({ limit: 1, type: 'GUILD_UPDATE' });
		const updateLog = fetchedLogs.entries.first();
		const executor = updateLog.executor;
		const afkEmbed = new MessageEmbed();
		const iconEmbed = new MessageEmbed();
		const nameEmbed = new MessageEmbed();
		if (oldGuild.afkChannelId !== newGuild.afkChannelId) {
			afkEmbed.setColor('#00FFE9')
				.setTitle('AFK channel updated')
				.setThumbnail(newGuild.iconURL({ dynamic: true }))
				.addFields(
					{ name: 'Old AFK channel', value: `<#${oldGuild.afkChannelId}>`, inline: true },
					{ name: 'New AFK channel', value: `<#${newGuild.afkChannelId}>`, inline: true },
					{ name: 'Changed by', value: `<@${executor.id}>` },
				)
				.setTimestamp()
				.setFooter('made with 🖤 by Suzan');
			if (logChannel) logChannel.send({ embeds: [afkEmbed] });
			console.log(`'${executor.tag}' changed '${guild.name}' AFK channel`);
		}
		if (oldGuild.icon !== newGuild.icon) {
			iconEmbed.setColor('#00FFE9')
				.setTitle('Guild icon updated')
				.setThumbnail(newGuild.iconURL({ dynamic: true }))
				.addFields(
					{ name: 'Old icon', value: oldGuild.iconURL({ dynamic: true }) },
					{ name: 'New icon', value: newGuild.iconURL({ dynamic: true }) },
					{ name: 'Changed by', value: `<@${executor.id}>` },
				)
				.setTimestamp()
				.setFooter('made with 🖤 by Suzan');
			if (logChannel) logChannel.send({ embeds: [iconEmbed] });
			console.log(`'${executor.tag}' changed '${guild.name}' icon`);
		}
		if (oldGuild.name !== newGuild.name) {
			nameEmbed.setColor('#00FFE9')
				.setTitle('Guild name updated')
				.setThumbnail(newGuild.iconURL({ dynamic: true }))
				.addFields(
					{ name: 'Old name', value: oldGuild.name, inline: true },
					{ name: 'New name', value: newGuild.name, inline: true },
					{ name: 'Changed by', value: `<@${executor.id}>` },
				)
				.setTimestamp()
				.setFooter('made with 🖤 by Suzan');
			if (logChannel) logChannel.send({ embeds: [nameEmbed] });
			console.log(`'${executor.tag}' changed a guild name from '${oldGuild.name}' to '${guild.name}'`);
		}
	},
};