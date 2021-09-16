const { MessageEmbed } = require('discord.js');
const { logChannelTopic } = require('../config.json');

module.exports = {
	name: 'channelUpdate',
	async execute(oldChannel, newChannel)
	{
		if (!newChannel.guild) return;
		const guild = newChannel.guild;
		const channels = guild.channels.cache;
		const logChannel = channels.find(c => c.topic === logChannelTopic);
		const fetchedLogs = await guild.fetchAuditLogs({ limit: 1, type: 'CHANNEL_UPDATE' });
		const updateLog = fetchedLogs.entries.first();
		const executor = updateLog.executor;
		const embed = new MessageEmbed()
			.setColor('#00FFE9')
			.setAuthor(executor.tag, executor.avatarURL())
			.addFields(
				{ name: 'Channel', value: `<#${newChannel.id}>`, inline: true },
				{ name: 'Category', value: `${newChannel.parent.name}`, inline: true },
				)
			.setTimestamp();

		if (oldChannel.name !== newChannel.name)
		{
			embed.setTitle('Channel name updated')
				.setDescription(`${oldChannel.name} ► ${newChannel.name}`);

			if (logChannel) await logChannel.send({ embeds: [embed] });
			console.log(`'${executor.tag}' renamed the channel '${newChannel.name}' at '${guild.name}'`);
		}

		if (oldChannel.parent !== newChannel.parent)
		{
			embed.setTitle('Channel category updated')
				.setDescription(`${oldChannel.parent.name} ► ${newChannel.parent.name}`);

			if (logChannel) await logChannel.send({ embeds: [embed] });
			console.log(`'${executor.tag}' chaged the channel '${newChannel.name}' category at '${guild.name}'`);
		}

		if (oldChannel.topic !== newChannel.topic)
		{
			if (oldChannel.topic === null)
			{
				oldChannel.topic = 'Nothing';
			}

			if (newChannel.topic === null)
			{
				newChannel.topic = 'Nothing';
			}

			embed.setTitle('Channel description updated')
				.setDescription(`${oldChannel.topic} ► ${newChannel.topic}`);

			if (logChannel) await logChannel.send({ embeds: [embed] });
			console.log(`'${executor.tag}' changed '${newChannel.name}' description at '${guild.name}'`);
		}

		if (oldChannel.nsfw !== newChannel.nsfw)
		{
			let nsfw;
			let nsfw1;
			if (oldChannel.nsfw)
			{
				nsfw = 'NSFW';
			}
			else
			{
				nsfw = 'SFW';
			}

			if (newChannel.nsfw)
			{
				nsfw1 = 'NSFW';
			}
			else
			{
				nsfw1 = 'SFW';
			}

			embed.setTitle('Channel NSFW status updated')
				.setDescription(`${nsfw} ► ${nsfw1}`);

			if (logChannel) await logChannel.send({ embeds: [embed] });
			console.log(`'${executor.tag}' changed '${newChannel.name}' NSFW status at '${guild.name}'`);
		}
	},
};