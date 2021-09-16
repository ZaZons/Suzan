const { MessageEmbed } = require('discord.js');
const { logChannelTopic } = require('../config.json');
const { goodbyeChannelTopic } = require('../config.json');
const { clientId } = require('../config.json');

module.exports = {
	name: 'guildMemberRemove',
	async execute(member)
	{
		if (member.id === clientId) return;
		const guild = member.guild;
		const channels = guild.channels.cache;
		const logChannel = channels.find(c => c.topic === logChannelTopic);
		const goodbyeChannel = channels.find(c => c.topic === goodbyeChannelTopic);
		const fetchedLogs = await guild.fetchAuditLogs({ limit: 1, type: 'MEMBER_KICK' });
		const kickLog = fetchedLogs.entries.first();
		const { executor, target, reason } = kickLog;
		const user = member.user;
		const createdAt = user.createdAt.toString();
		const userCreated = createdAt.slice(4, 15);
		const totalMembers = guild.memberCount.toString();
		let kicked = 0;

		if (kickLog)
		{
			if (target.id === member.id)
			{
				kicked = 1;
			}
		}

		const goodbyeEmbed = new MessageEmbed()
			.setColor('#00FFE9')
			.setAuthor(user.tag, user.avatarURL())
			.setTitle('Catcha later mate')
			.addFields(
				{ name: 'Username', value: user.tag, inline: true },
				{ name: 'User ID', value: user.id, inline: true },
				{ name: '\u200b', value: '\u200b', inline: true },
				{ name: 'Joined Discord at', value: userCreated, inline: true },
				{ name: 'Total members', value: totalMembers, inline: true },
			)
			.setTimestamp();

		const logEmbed = new MessageEmbed()
			.setColor('#00FFE9')
			.setAuthor(executor.tag, executor.avatarURL())
			.setTitle('User banned')
			.setDescription(`<@${user.id}>`)
			.setTimestamp();

		if (kicked === 0)
		{
			logEmbed.setTitle('User left');
			console.log(`'${user.tag}' left '${guild.name}'`);
		}

		if (kicked === 1)
		{
			if (member.id === target.id)
			{
				logEmbed.setTitle('User kicked');

				console.log(`'${user.tag}' was kicked from '${guild.name}'`);

				if (reason)
				{
					logEmbed.addField('Reason', reason, true);
					console.log(`'${executor.tag}' kicked '${user.tag}' from '${guild.name}' because '${reason}'`);
				}
				else
				{
					console.log(`'${user.tag}' was kicked from '${guild.name}'`);
				}
			}
		}

		if (goodbyeChannel) await goodbyeChannel.send({ embeds: [goodbyeEmbed] });
		if (logChannel) await logChannel.send({ embeds: [logEmbed] });
	},
};