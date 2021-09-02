const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Replies with user info'),
	async execute(interaction) {
		await interaction.reply(`Username: ${interaction.user.tag}\nUser ID: ${interaction.user.id}`);
	},
};