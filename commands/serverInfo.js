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
		let embedDone = new MessageEmbed();
		guild.members.fetch()
			.then(fetchedMembers => {
				const members = fetchedMembers.size;
				const embed = new MessageEmbed()
					.setColor('#00FFE9')
					.setThumbnail(guild.iconURL({ dynamic: true }))
					.setTitle(guild.name)
					.addFields(
						{ name: 'Server ID', value: guild.id },
						{ name: 'Server birth', value: guildCreated, inline: true },
						{ name: 'Owner', value: `<@${guildOwner}>`, inline: true },
						{ name: `Total members: ${members}`, value: 'bla bla', inline: true },
					)
					.setFooter('made with 🖤 by Suzan');
				if (guild.afkChannel != null) {
					embed.addField('AFK channel', guild.afkChannel.name);
				}
				console.log(`Total members: ${members}`);
				embedDone = embed;
			});
		await interaction.reply({ embeds: [embedDone] });
		console.log(`${ user.tag } asked for ${ guild.name } info in '#${ interaction.channel.name }'.`);
	},
};
