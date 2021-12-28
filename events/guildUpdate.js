require('dotenv').config();
const { MessageEmbed } = require('discord.js');
const findLog = require('../database/findLog.js');

module.exports = {
	name: 'guildUpdate',
	async execute(oldGuild, newGuild) {
		try {
			const logType = 'channelLog';
			const guild = newGuild;
			const channelLog = await findLog.findLog(guild, logType);
			const generalLog = await findLog.findLog(guild, 'generalLog');
			const fetchedLogs = await guild.fetchAuditLogs({ limit: 1, type: 'GUILD_UPDATE' });
			const executor = fetchedLogs.entries.first().executor;
			//const executor = updateLog.executor;

			const embed = new MessageEmbed()
				.setColor(process.env.color)
				.setThumbnail(newGuild.iconURL({ dynamic: true }))
				.setTimestamp()
				.setFooter('made with 🖤 by Suzan');

			if (oldGuild.afkChannelId !== newGuild.afkChannelId) {
				embed.setTitle('AFK channel updated')
					.setFields(
						{ name: 'Old AFK channel', value: `<#${oldGuild.afkChannelId}>`, inline: true },
						{ name: 'New AFK channel', value: `<#${newGuild.afkChannelId}>`, inline: true },
						{ name: 'Changed by', value: `<@${executor.id}>` },
					);

				console.log(`'${executor.tag}' changed '${guild.name}' AFK channel`);

				if (channelLog) {
					await channelLog.send({ embeds: [embed] });
				} else {
					if (generalLog) await generalLog.send({ embeds: [embed] });
				}
			}

			if (oldGuild.icon !== newGuild.icon) {
				embed.setTitle('Guild icon updated')
					.setFields(
						{ name: 'Old icon', value: oldGuild.iconURL({ dynamic: true }) },
						{ name: 'New icon', value: newGuild.iconURL({ dynamic: true }) },
						{ name: 'Changed by', value: `<@${executor.id}>` },
					);

				console.log(`'${executor.tag}' changed '${guild.name}' icon`);

				if (channelLog) {
					await channelLog.send({ embeds: [embed] });
				} else {
					if (generalLog) await generalLog.send({ embeds: [embed] });
				}
			}

			if (oldGuild.name !== newGuild.name) {
				embed.setTitle('Guild name updated')
					.setFields(
						{ name: 'Old name', value: oldGuild.name, inline: true },
						{ name: 'New name', value: newGuild.name, inline: true },
						{ name: 'Changed by', value: `<@${executor.id}>` },
					);

				console.log(`'${executor.tag}' changed a guild name from '${oldGuild.name}' to '${guild.name}'`);

				if (channelLog) {
					await channelLog.send({ embeds: [embed] });
				} else {
					if (generalLog) await generalLog.send({ embeds: [embed] });
				}

				const connection = await require('../database/db.js');
				const sql = `SELECT * FROM guilds WHERE id = '${oldGuild.id}'`;
				let isUpdatable = false;
				await connection.query(sql).then(result => {
					if (result[0][0]) isUpdatable = true;
				}).catch(console.log);

				if (isUpdatable) {
					const sql1 = `UPDATE guilds SET name = '${newGuild.name}' WHERE guilds.id = '${oldGuild.id}'`;
					await connection.query(sql1).catch(console.log);
				}
			}
		} catch (error) {
			console.log(error);
		}
	},
};