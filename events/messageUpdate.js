const { MessageEmbed } = require('discord.js');
const { logChannelTopic } = require('../config.json');

module.exports = {
	name: 'messageUpdate',
	async execute(oldMessage, newMessage)
	{
		if (!newMessage.guild) return;
		const guild = newMessage.guild;
		const channels = guild.channels.cache;
		const logChannel = channels.find(c => c.topic === logChannelTopic);
		const author = newMessage.author;
		let oldContent;

		const embed = new MessageEmbed()
			.setColor('#00FFE9')
			.setAuthor(author.tag, author.avatarURL())
			.setTitle('Message edited')
			.setTimestamp();

		if (oldMessage.content !== newMessage.content)
		{
			if (oldMessage.content === null)
			{
				oldContent = 'null (couldn\'t catch)';
			}
			else
			{
				oldContent = oldMessage.content;
			}

			embed.setDescription(`${oldContent} ► ${newMessage.content}`)
				.addFields(
					{ name: 'Channel', value: `${newMessage.channel}`, inline: true },
					{ name: 'Category', value: `${newMessage.channel.parent.name}`, inline: true },
				);

			if (logChannel) await logChannel.send({ embeds: [embed] });
			console.log(`'${author.tag}' edited a message in '${newMessage.channel.name}' at '${guild.name}'`);
		}
	},
};