const { MessageEmbed } = require('discord.js');
const { logChannelTopic } = require('../config.json');

module.exports = {
	name: 'channelUpdate',
	async execute(oldChannel, newChannel) {
		if (!newChannel.guild) return;
		const guild = newChannel.guild;
		const channels = guild.channels.cache;
		const logChannel = channels.find(c => c.topic === logChannelTopic);
		const fetchedLogs = await guild.fetchAuditLogs({ limit: 1, type: 'CHANNEL_UPDATE' });
		const updateLog = fetchedLogs.entries.first();
		const executor = updateLog.executor;
		const nameEmbed = new MessageEmbed();
		const topicEmbed = new MessageEmbed();
		const nsfwEmbed = new MessageEmbed();
		if (oldChannel.name !== newChannel.name) {
			nameEmbed.setColor('#00FFE9')
				.setTitle('Channel name updated')
				.setThumbnail(executor.avatarURL({ dynamic: true }))
				.setDescription(`<#${newChannel.id}>`)
				.addFields(
					{ name: 'Old name', value: oldChannel.name, inline: true },
					{ name: 'New name', value: newChannel.name, inline: true },
					{ name: 'Renamed by', value: `<@${executor.id}>` },
				)
				.setTimestamp()
				.setFooter('made with 🖤 by Suzan');
			if (logChannel) {
				await logChannel.send({ embeds: [nameEmbed] });
				console.log(`'${executor.tag}' renamed the channel '${newChannel.name}' at '${guild.name}'`);
			}
		}
		if (oldChannel.topic !== newChannel.topic) {
			if (oldChannel.topic === null) {
				oldChannel.topic = 'Nothing';
			}
			if (newChannel.topic === null) {
				newChannel.topic = 'Nothing';
			}
			topicEmbed.setColor('#00FFE9')
				.setTitle('Channel description updated')
				.setThumbnail(executor.avatarURL({ dynamic: true }))
				.setDescription(`<#${newChannel.id}>`)
				.addFields(
					{ name: 'Old description', value: oldChannel.topic, inline: true },
					{ name: 'New description', value: newChannel.topic, inline: true },
					{ name: 'Changed by', value: `<@${executor.id}>` },
				)
				.setTimestamp()
				.setFooter('made with 🖤 by Suzan');
			if (logChannel) {
				await logChannel.send({ embeds: [topicEmbed] });
				console.log(`'${executor.tag}' changed '${newChannel.name}' description at '${guild.name}'`);
			}
		}
		if (oldChannel.nsfw !== newChannel.nsfw) {
			let nsfw;
			let nsfw1;
			if (oldChannel.nsfw) {
				nsfw = 'NSFW';
			}
			else {
				nsfw = 'SFW';
			}
			if (newChannel.nsfw) {
				nsfw1 = 'NSFW';
			}
			else {
				nsfw1 = 'SFW';
			}
			nsfwEmbed.setColor('#00FFE9')
				.setTitle('Channel NSFW status updated')
				.setThumbnail(executor.avatarURL({ dynamic: true }))
				.setDescription(`<#${newChannel.id}>`)
				.addFields(
					{ name: 'Old NSFW status', value: nsfw, inline: true },
					{ name: 'New NSFW status', value: nsfw1, inline: true },
					{ name: 'Changed by', value: `<@${executor.id}>` },
				)
				.setTimestamp()
				.setFooter('made with 🖤 by Suzan');
			if (logChannel) {
				await logChannel.send({ embeds: [nsfwEmbed] });
				console.log(`'${executor.tag}' changed '${newChannel.name}' NSFW status at '${guild.name}'`);
			}
		}
	},
};