const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Replies with server info'),
	async execute(interaction) {
		const guild = interaction.guild;
		const createdAt = guild.createdAt.toString();
		const guildCreated = createdAt.slice(4, 15);
		const user = interaction.user;
		const guildOwner = guild.ownerId;
		const totalMembers = guild.memberCount;
		const presences = guild.presences.cache;
		const embed = new MessageEmbed()
			.setColor('#00FFE9')
			.setTitle(guild.name)
			.setThumbnail(guild.iconURL({ dynamic: true }))
			.addFields(
				{ name: 'Server ID', value: guild.id },
				{ name: 'Server birth', value: guildCreated, inline: true },
				{ name: 'Owner', value: `<@${guildOwner}>`, inline: true },
				{ name: 'Members', value: `Total: ${totalMembers}\nOnline: ${ presences.size }`, inline: true },
			)
			.setTimestamp()
			.setFooter('made with 🖤 by Suzan');
		if (guild.afkChannel != null) {
			embed.addField('AFK channel', guild.afkChannel.name);
		}
		await interaction.reply({ embeds: [embed] });
		console.log(`${ user.tag } asked for ${ guild.name } info in '#${ interaction.channel.name }'.`);
	},
};
