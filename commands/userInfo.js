const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Replies with user info'),
	async execute(interaction) {
		const info = `${interaction.user.avatarURL(interaction.user)}\nUsername: ${interaction.user.tag}\nUser ID: ${interaction.user.id}`;
		const embed = new MessageEmbed()
			.setColor('#00FFE9')
			.setTitle('User info')
			.setDescription(info);

		await interaction.reply({ ephemeral: true, embeds: [embed] });
	},
};
