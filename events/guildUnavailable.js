module.exports = {
	name: 'guildUnavailable',
	async execute(guild)
	{
		console.log(`Guild '${guild.name}' just became unavailable.`);
	},
};