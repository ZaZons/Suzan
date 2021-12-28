require('dotenv').config();
const { MessageEmbed } = require('discord.js');
const findLog = require('../database/findLog.js');

module.exports = {
	name: 'guildMemberUpdate',
	async execute(oldMember, newMember) {
		try {
			if (oldMember.id === process.env.clientId) return;
			const logType = 'memberLog';
			const guild = newMember.guild;
			const channelLog = await findLog.findLog(guild, logType);
			const generalLog = await findLog.findLog(guild, 'generalLog');
			const fetchedLogs = await guild.fetchAuditLogs({ limit: 1, type: 'MEMBER_UPDATE' });
			const executor = fetchedLogs.entries.first().executor;
			//const executor = updateLog.executor;
			const oldUser = oldMember.user;
			const newUser = newMember.user;

			const embed = new MessageEmbed()
				.setColor(process.env.color)
				.setThumbnail(newUser.avatarURL({ dynamic: true }))
				.setDescription(`<@${newMember.id}>`)
				.setTimestamp()
				.setFooter('made with 🖤 by Suzan');

			if (oldMember.nickname !== newMember.nickname) {
				let oldNickname = oldMember.nickname;
				let newNickname = newMember.nickname;

				if (oldMember.nickname === null) oldNickname = `Nothing (${newUser.username})`;
				if (newMember.nickname === null) newNickname = `Nothing (${oldUser.username})`;

				embed.setTitle('Member nickname updated')
					.addFields(
						{ name: 'Old nickname', value: oldNickname, inline: true },
						{ name: 'New nickname', value: newNickname, inline: true },
						{ name: 'Changed by', value: `<@${executor.id}>` },
					);

				console.log(`'${newUser.tag}' nickname changed from '${oldNickname}' to '${newNickname}' at '${guild.name}'`);

				if (channelLog) {
					await channelLog.send({ embeds: [embed] });
				} else {
					if (generalLog) await generalLog.send({ embeds: [embed] });
				}
			}

			if (oldMember.roles !== newMember.roles) {
				const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));
				const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));

				if (removedRoles.size > 0) {
					embed.setTitle('Member roles removed')
						.addField('Roles removed', `${removedRoles.map(r => r.name)}`);

					console.log(`The roles '${removedRoles.map(r => r.name)}' were removed from '${newMember.displayName}' at '${guild.name}'`);

					if (channelLog) {
						await channelLog.send({ embeds: [embed] });
					} else {
						if (generalLog) await generalLog.send({ embeds: [embed] });
					}
				}

				if (addedRoles.size > 0) {
					embed.setTitle('Member roles added')
						.addField('Roles added', `${addedRoles.map(r => r.name)}`);

					console.log(`The roles '${addedRoles.map(r => r.name)}' were added to '${newMember.displayName}' at '${guild.name}'`);

					if (channelLog) {
						await channelLog.send({ embeds: [embed] });
					} else {
						if (generalLog) await generalLog.send({ embeds: [embed] });
					}
				}
			}
		} catch (error) {
			console.log(error);
		}
	},
};