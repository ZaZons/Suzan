const { SlashCommandBuilder } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with pong'),
	async execute(interaction) {
		const user = interaction.user;
		console.log(`${user.tag} just did a ping, let's pong the shit outta that ping`);
		await interaction.deferReply();
		await wait(1000);
		await interaction.editReply('pong');
	},
};