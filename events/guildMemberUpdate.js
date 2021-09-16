const { MessageEmbed } = require('discord.js');
const { logChannelTopic } = require('../config.json');

module.exports = {
	name: 'guildMemberUpdate',
	async execute(oldMember, newMember)
	{
		const guild = newMember.guild;
		const channels = guild.channels.cache;
		const logChannel = channels.find(c => c.topic === logChannelTopic);
		/*
		const fetchedLogs = await guild.fetchAuditLogs({ limit: 1, type: 'MEMBER_UPDATE' });
		const updateLog = fetchedLogs.entries.first();
		const executor = updateLog.executor;
		*/
		const newUser = newMember.user;
		const embed = new MessageEmbed()
			.setColor('#00FFE9')
			.setAuthor(newUser.tag, newUser.avatarURL())
			.setTimestamp();

		if (oldMember.displayName !== newMember.displayName)
		{
			embed.setTitle('Member nickname updated')
				.setDescription(`${oldMember.displayName} ► ${newMember.displayName}`);

			if (logChannel) logChannel.send({ embeds: [embed] });
			console.log(`'${newUser.tag}' nickname changed from '${oldMember.displayName}'
			to '${newMember.displayName}' at '${guild.name}'`);
		}

		if (oldMember.roles !== newMember.roles)
		{
			const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));
			const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));

			if (removedRoles.size > 0)
			{
				embed.setTitle('Member roles removed')
					.setDescription(`${removedRoles.map(r => r.name)}`);

				console.log(`''${newMember.tag}' at '${guild.name}'`);
				console.log(`The roles '${removedRoles.map(r => r.name)}' were removed from '${newMember.displayName}' at '${guild.name}'`);
				if (logChannel) logChannel.send({ embeds: [embed] });
			}

			if (addedRoles.size > 0)
			{
				embed.setTitle('Member roles added')
					.setDescription(`${addedRoles.map(r => r.name)}`);

				console.log(`The roles '${addedRoles.map(r => r.name)}' were added to '${newMember.displayName}' at '${guild.name}'`);
				if (logChannel) logChannel.send({ embeds: [embed] });
			}
		}
	},
};