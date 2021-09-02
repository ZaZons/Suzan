const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Replies with server info'),
	async execute(interaction) {
		await interaction.reply(`Server ID: ${interaction.guild.id}\nServer name: ${interaction.guild.name}\nAFK channel: ${interaction.guild.afkChannel}`);
	},
};