// Require the discord.js library
const { Client, Intents } = require ('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client ({ intents: [Intents.FLAGS.GUILDS] });

// Dizer q ta a funceminar
client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'ping') {
		await interaction.reply('Pong!');
	}
	else if (commandName === 'server') {
		await interaction.reply(`Server ID: ${interaction.guild.id}\nServer name: ${interaction.guild.name}\nAFK channel: ${interaction.guild.afkChannel}`);
	}
	else if (commandName === 'user') {
		await interaction.reply(`Username: ${interaction.user.tag}\nUser ID: ${interaction.user.id}`);
	}
});

// Login to discord with the token
client.login(token);

