module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		console.log(`Ready! Logged in as '${client.user.tag}' in ${client.guilds.cache.size} servers with a total of ${client.users.cache.size} users.`);
		client.user.setPresence({ activities: [{ name: 'with your data' }], status: 'idle' });
		/*
		client.guilds.cache.forEach(guild => {
			guild.channels.fetch().then(channel => {
				channel.forEach(c => {
					channel.messages.fetch().then(messages => {
						messages.forEach(msg => console.log(msg.content));
					});
				});
			});
		});
			channels.forEach(channel => {
			});*/
	},
};