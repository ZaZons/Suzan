const { MessageEmbed } = require('discord.js');
const { welcomeChannelTopic } = require('../config.json');
const { logChannelTopic } = require('../config.json');

module.exports = {
	name: 'guildMemberAdd',
	async execute(member)
	{
		const guild = member.guild;
		const channels = guild.channels.cache;
		const logChannel = channels.find(c => c.topic === logChannelTopic);
		const welcomeChannel = channels.find(c => c.topic === welcomeChannelTopic);
		const user = member.user;
		const createdAt = user.createdAt.toString();
		const userCreated = createdAt.slice(4, 15);
		const totalMembers = guild.memberCount.toString();
		const type = user.bot ? 'Bot' : 'Human';

		const welcomeEmbed = new MessageEmbed()
			.setColor('#00FFE9')
			.setAuthor(user.tag, user.avatarURL())
			.setTitle('*Texan accent intensifies*\nCountry roads just took home our good ol\' pal')
			.addFields(
				{ name: 'Username', value: user.tag, inline: true },
				{ name: 'User ID', value: user.id, inline: true },
				{ name: '\u200b', value: '\u200b', inline: true },
				{ name: 'Joined Discord at', value: userCreated, inline: true },
				{ name: 'Type', value: type, inline: true },
				{ name: 'Total members', value: totalMembers },
			)
			.setTimestamp();

		const logEmbed = new MessageEmbed()
			.setColor('#00FFE9')
			.setAuthor(user.tag, user.avatarURL())
			.setTitle('User joined')
			.addFields(
				{ name: 'Username', value: user.tag, inline: true },
				{ name: 'User ID', value: user.id, inline: true },
				{ name: '\u200b', value: '\u200b', inline: true },
				{ name: 'Joined Discord at', value: userCreated, inline: true },
				{ name: 'Type', value: type, inline: true },
				{ name: 'Total members', value: totalMembers, inline: true },
			)
			.setTimestamp();

		if (welcomeChannel) await welcomeChannel.send({ embeds: [welcomeEmbed] });
		if (logChannel) await logChannel.send({ embeds: [logEmbed] });
		console.log(`'${member.user.tag}' is super cool and joined '${guild.name}'`);
	},
};