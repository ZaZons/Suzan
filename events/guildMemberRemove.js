require('dotenv').config();
const { MessageEmbed } = require('discord.js');
const findLog = require('../database/findLog.js');

module.exports = {
	name: 'guildMemberRemove',
	async execute(member) {
		try {
			const user = member.user;
			const createdAt = user.createdAt.toString();
			const userCreated = createdAt.slice(4, 15);
			const totalMembers = member.guild.memberCount.toString();
			const type = user.bot ? 'Bot' : 'Human';

			let goodbyeChannel;
			const connection = await require('../database/db.js');
			const sql = `SELECT goodbyeChannel FROM guilds WHERE id = '${member.guild.id}'`
			await connection.query(sql).then(result => {
				if (result[0][0]) goodbyeChannel = member.guild.channels.cache.find(c => c.id === result[0][0].goodbyeChannel);
			}).catch(console.log);

			if (goodbyeChannel) {
				const goodbyeEmbed = new MessageEmbed()
					.setColor(process.env.color)
					.setTitle('Catcha later mate')
					.setThumbnail(user.avatarURL({ dynamic: true }))
					.setDescription(`<@${user.id}>`)
					.addFields(
						{ name: 'Username', value: user.tag, inline: true },
						{ name: 'User ID', value: user.id, inline: true },
						{ name: '\u200b', value: '\u200b', inline: true },
						{ name: 'Joined Discord at', value: userCreated, inline: true },
						{ name: 'Total members', value: totalMembers, inline: true },
					)
					.setTimestamp()
					.setFooter('Made with 🖤 by Suzan');

				await goodbyeChannel.send({ embeds: [goodbyeEmbed] });
			}

			const logEmbed = new MessageEmbed()
				.setColor(process.env.color)
				.setTitle('User left')
				.setThumbnail(user.avatarURL({ dynamic: true }))
				.setDescription(`<@${user.id}>`)
				.addFields(
					{ name: 'Username', value: user.tag, inline: true },
					{ name: 'User ID', value: user.id, inline: true },
					{ name: '\u200b', value: '\u200b', inline: true },
					{ name: 'Joined Discord at', value: userCreated, inline: true },
					{ name: 'Type', value: type, inline: true },
					{ name: 'Total members', value: totalMembers, inline: true },
				)
				.setTimestamp()
				.setFooter('made with 🖤 by Suzan');

			const logType = 'memberLog';
			const channelLog = await findLog.findLog(member.guild, logType);
			if (channelLog) {
				await channelLog.send({ embeds: [logEmbed] });
			} else {
				const generalLog = await findLog.findLog(member.guild, 'generalLog');
				if (generalLog) await generalLog.send({ embeds: [logEmbed] });
			}

			console.log(`'${member.user.tag}' left '${member.guild.name}'`);
		} catch (error) {
			console.log(error);
		}
	},
};