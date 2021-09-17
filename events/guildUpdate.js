const { MessageEmbed } = require('discord.js');
const { logChannelTopic } = require('../config.json');

module.exports = {
	name: 'guildUpdate',
	async execute(oldGuild, newGuild)
	{
		const guild = newGuild;
		const channels = guild.channels.cache;
		const logChannel = channels.find(c => c.topic === logChannelTopic);
		const fetchedLogs = await guild.fetchAuditLogs({ limit: 1, type: 'GUILD_UPDATE' });
		const updateLog = fetchedLogs.entries.first();
		const executor = updateLog.executor;

		const embed = new MessageEmbed()
			.setColor('#00FFE9')
			.setAuthor(executor.tag, executor.avatarURL())
			.setTimestamp();

		if (oldGuild.afkChannelId !== newGuild.afkChannelId)
		{
			embed.setTitle('AFK channel updated')
				.setDescription(`${oldGuild.afkChannel.name} ► ${newGuild.afkChannel.name}`)
				.addField('Category', `${newGuild.afkChannel.parent.name}`);

			if (logChannel) await logChannel.send({ embeds: [embed] });
			console.log(`'${executor.tag}' changed AFK channel at '${guild.name}'`);
		}

		if (oldGuild.icon !== newGuild.icon)
		{
			embed.setTitle('Guild icon updated')
				.setDescription(`${oldGuild.iconURL()} ► ${newGuild.iconURL()}`);

			if (logChannel) logChannel.send({ embeds: [embed] });
			console.log(`'${executor.tag}' changed '${guild.name}' icon`);
		}

		if (oldGuild.name !== newGuild.name)
		{
			embed.setTitle('Guild name updated')
				.setDescription(`${oldGuild.name} ► ${newGuild.name}`);

			if (logChannel) logChannel.send({ embeds: [embed] });
			console.log(`'${executor.tag}' changed a guild name from '${oldGuild.name}' to '${guild.name}'`);
		}
	},
};