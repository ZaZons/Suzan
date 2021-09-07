module.exports = {
	name: 'interactionCreate',
	execute(interaction) {
		console.log(`'${interaction.user.tag}' triggered an action in '#${interaction.channel.name}' at '${interaction.guild.name}'`);
	},
};