const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Replies with user info'),
	async execute(interaction) {
		const guild = interaction.guild;
		const user = interaction.user;
		const member = interaction.member;
		const createdAt = user.createdAt.toString();
		const userCreated = createdAt.slice(4, 15);
		const joinedAt = member.joinedAt.toString();
		const userJoined = joinedAt.slice(4, 15);
		let nickname = member.nickname;
		if (nickname === null) {
			nickname = user.username;
		}
		const embed = new MessageEmbed()
			.setColor('#00FFE9')
			.setThumbnail(user.avatarURL())
			.setTitle(nickname)
			.addFields(
				{ name: 'Username', value: user.tag },
				{ name: 'User ID', value: user.id },
				{ name: 'Joined Discord at', value: userCreated, inline: true },
				{ name: `Joined ${guild} at`, value: userJoined, inline: true },
			)
			.setFooter('made with 🖤 by Suzan');
		console.log(`${user.tag} asked for user info in '#${ interaction.channel.name }' at '${ guild.name }'.`);
		await interaction.reply({ ephemeral: true, embeds: [embed] });
	},
};
