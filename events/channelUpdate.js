require('dotenv').config();
const { MessageEmbed } = require('discord.js');
const findLog = require('../database/findLog.js');

module.exports = {
	name: 'channelUpdate',
	async execute(oldChannel, newChannel) {
		try	{
			if (!newChannel.guild) return;
			const logType = 'channelLog';
			const guild = newChannel.guild;
			const channelLog = await findLog.findLog(guild, logType);
			const generalLog = await findLog.findLog(guild, 'generalLog');
			const fetchedLogs = await guild.fetchAuditLogs({ limit: 1, type: 'CHANNEL_UPDATE' });
			const executor = fetchedLogs.entries.first().executor;
			//const executor = updateLog.executor;

			const embed = new MessageEmbed()
				.setColor(process.env.color)
				.setThumbnail(executor.avatarURL({ dynamic: true }))
				.setDescription(`<#${newChannel.id}>`)
				.setTimestamp()
				.setFooter('Made with 🖤 by Suzan');

			if (oldChannel.name !== newChannel.name) {
				embed.setTitle('Channel name updated')
					.setFields(
						{ name: 'Old name', value: oldChannel.name, inline: true },
						{ name: 'New name', value: newChannel.name, inline: true },
						{ name: 'Renamed by', value: `<@${executor.id}>` },
					);
					
				console.log(`'${executor.tag}' renamed the channel '${newChannel.name}' at '${guild.name}'`);

				if (channelLog) {
					await channelLog.send({ embeds: [embed] });
				} else {
					if (generalLog) await generalLog.send({ embeds: [embed] });
				}
			}

			if (oldChannel.topic !== newChannel.topic) {
				if (oldChannel.topic === null) oldChannel.topic = 'Nothing';
				if (newChannel.topic === null) newChannel.topic = 'Nothing';

				embed.setTitle('Channel description updated')
					.setFields(
						{ name: 'Old description', value: oldChannel.topic, inline: true },
						{ name: 'New description', value: newChannel.topic, inline: true },
						{ name: 'Changed by', value: `<@${executor.id}>` },
					);

				console.log(`'${executor.tag}' changed '${newChannel.name}' description at '${guild.name}'`);

				if (channelLog) {
					await channelLog.send({ embeds: [embed] });
				} else {
					if (generalLog) await generalLog.send({ embeds: [embed] });
				}
			}

			if (oldChannel.nsfw !== newChannel.nsfw) {
				const oldNSFW = oldChannel.nsfw ? 'NSFW' : 'SFW';
				const newNSFW = newChannel.nsfw ? 'NSFW' : 'SFW';

				embed.setTitle('Channel NSFW status updated')
					.addFields(
						{ name: 'Old NSFW status', value: oldNSFW, inline: true },
						{ name: 'New NSFW status', value: newNSFW, inline: true },
						{ name: 'Changed by', value: `<@${executor.id}>` },
					);

				console.log(`'${executor.tag}' changed '${newChannel.name}' NSFW status at '${guild.name}'`);

				if (channelLog) {
					await channelLog.send({ embeds: [embed] });
				} else {
					if (generalLog) await generalLog.send({ embeds: [embed] });
				}
			}
		} catch (error) {
			console.log(error);
		}
	},
};