const { MessageEmbed } = require('discord.js');
const { logChannelTopic } = require('../config.json');

module.exports = {
	name: 'guildMemberUpdate',
	async execute(oldMember, newMember) {
		const guild = newMember.guild;
		const channels = guild.channels.cache;
		const logChannel = channels.find(c => c.topic === logChannelTopic);
		const fetchedLogs = await guild.fetchAuditLogs({ limit: 1, type: 'MEMBER_UPDATE' });
		const updateLog = fetchedLogs.entries.first();
		const executor = updateLog.executor;
		const oldUser = oldMember.user;
		const newUser = newMember.user;
		const nameEmbed = new MessageEmbed();
		const nicknameEmbed = new MessageEmbed();
		const rolesEmbed = new MessageEmbed();
		const voiceEmbed = new MessageEmbed();
		if (oldMember.nickname !== newMember.nickname) {
			let oldNickname = oldMember.nickname;
			let newNickname = newMember.nickname;
			if (oldMember.nickname === null) oldNickname = `Nothing (${newUser.username})`;
			if (newMember.nickname === null) newNickname = `Nothing (${oldUser.username})`;
			nicknameEmbed.setColor('#00FFE9')
				.setTitle('Member nickname changed')
				.setThumbnail(newUser.avatarURL({ dynamic: true }))
				.setDescription(`<@${newMember.id}>`)
				.addFields(
					{ name: 'Old nickname', value: oldNickname, inline: true },
					{ name: 'New nickname', value: newNickname, inline: true },
					{ name: 'Changed by', value: `<@${executor.id}>` },
				)
				.setTimestamp()
				.setFooter('made with 🖤 by Suzan');
			if (logChannel) logChannel.send({ embeds: [nicknameEmbed] });
		}
		if (oldUser.username !== newUser.username) {
			nameEmbed.setColor('#00FFE9')
				.setTitle('Member username updated')
				.setThumbnail(newMember.user.avatarURL({ dynamic: true }))
				.setDescription(`<@${newMember.id}>`)
				.addFields(
					{ name: 'Old username', value: oldUser.username, inline: true },
					{ name: 'New username', value: newUser.username, inline: true },
				)
				.setTimestamp()
				.setFooter('made with 🖤 by Suzan');
			if (logChannel) logChannel.send({ embeds: [nameEmbed] });
		}
		if (oldMember.roles !== newMember.roles) {
			const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));
			const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
			rolesEmbed.setColor('#00FFE9')
				.setThumbnail(newMember.user.avatarURL({ dynamic: true }))
				.setDescription(`<@${newMember.id}>`)
				.setTimestamp()
				.setFooter('made with 🖤 by Suzan');
			if (removedRoles.size > 0) {
				console.log(`The roles '${removedRoles.map(r => r.name)}' were removed from '${oldMember.displayName}' at '${guild.name}'`);
				rolesEmbed.setTitle('Member roles removed')
					.addField('Roles removed', `${removedRoles.map(r => r.name)}`);
			}
			if (addedRoles.size > 0) {
				console.log(`The roles '${addedRoles.map(r => r.name)}' were added to '${oldMember.displayName}' at '${guild.name}'`);
				rolesEmbed.setTitle('Member roles added')
					.addField('Roles added', `${addedRoles.map(r => r.name)}`);
			}
			if (logChannel) logChannel.send({ embeds: [rolesEmbed] });
		}
        if (oldMember.voice !== newMember.voice) {
            console.log(oldMember.voice);
            console.log(newMember.voice);
        }
	},
};