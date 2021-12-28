require('dotenv').config();
const { MessageEmbed } = require('discord.js');
const findLog = require('../database/findLog.js');

module.exports = {
	name: 'messageUpdate',
	async execute(oldMessage, newMessage) {
		try {
			if (!newMessage.guild) return;
			if (!newMessage.channel) return;
			if (!newMessage.content) return;
			const logType = 'messageLog';
			const guild = newMessage.guild;
			const author = newMessage.author;

			const embed = new MessageEmbed()
				.setColor(process.env.color)
				.setTitle('Message updated')
				.setDescription(`<#${newMessage.channelId}>`)
				.setTimestamp()
				.setFooter('made with 🖤 by Suzan');

			if (oldMessage.content !== newMessage.content) {
				const oldContent = oldMessage.partial ? 'null (couldn\'t catch)' : oldMessage.content;

				embed.setThumbnail(author.avatarURL({ dynamic: true }))
					.addFields(
					/* { name: 'Old content', value: oldContent, inline: true },
					{ name: 'New content', value: newMessage.content, inline: true }, */
					{ name: 'Message author', value: `<@${author.id}>` },
					);

				console.log(`'${author.tag}' edited a message in '${newMessage.channel.name}' at '${guild.name}'`);

				const channelLog = await findLog.findLog(guild, logType);
				if (channelLog) {
					await channelLog.send({ embeds: [embed] });
				} else {
					const generalLog = await findLog.findLog(guild, 'generalLog');
					if (generalLog) await generalLog.send({ embeds: [embed] });
				}
			}
		} catch (error) {
			console.log(error);
		}
	},
};