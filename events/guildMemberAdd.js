require('dotenv').config();
const { MessageEmbed } = require('discord.js');
const findLog = require('../database/findLog.js');

module.exports = {
	name: 'guildMemberAdd',
	async execute(member) {
		try {
			const user = member.user;
			const userFlags = await user.fetchFlags();
			const flags = userFlags.toArray();
			const userCreated = user.createdAt.toString().slice(4, 15);
			const totalMembers = member.guild.memberCount.toString();
			const type = user.bot ? 'Bot' : 'Human';
			let welcomeChannel;
			const connection = await require('../database/db.js');
			const sql = `INSERT INTO users (id, username, tag, flags, createdAt, type) VALUES ('${user.id}', '${user.username}', '${user.discriminator}', '${flags}', '${userCreated}', '${type}')`;
			await connection.query(sql).catch(console.log);

			if (welcomeChannel) {
				const welcomeEmbed = new MessageEmbed()
					.setColor(process.env.color)
					.setTitle('*Texan accent intensifies*\nCountry roads just took home our good ol\' pal')
					.setThumbnail(user.avatarURL({ dynamic: true }))
					.setDescription(`<@${user.id}>`)
					.addFields(
						{ name: 'Username', value: user.tag, inline: true },
						{ name: 'User ID', value: user.id, inline: true },
						{ name: '\u200b', value: '\u200b', inline: true },
						{ name: 'Joined Discord at', value: userCreated, inline: true },
						{ name: 'Type', value: type, inline: true },
						{ name: 'Total members', value: totalMembers },
					)
					.setTimestamp()
					.setFooter('made with 🖤 by Suzan');

				await welcomeChannel.send({ embeds: [welcomeEmbed] });
			}

			const logEmbed = new MessageEmbed()
				.setColor(process.env.color)
				.setTitle('User joined')
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

			console.log(`'${member.user.tag}' is super cool and joined '${member.guild.name}'`);
		} catch (error) {
			console.log(error);
		}
	},
};