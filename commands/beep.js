const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('beep')
		.setDescription('Replies with boop'),
	async execute(interaction) {
		const user = interaction.user;
		console.log(`${user.tag} just beeped, let's boop`);
		await interaction.reply('boop');
	},
};