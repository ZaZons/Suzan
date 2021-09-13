const { MessageEmbed } = require('discord.js');
const { logChannelTopic } = require('../config.json');

module.exports = {
	name: 'messageDeleteBulk',
	async execute(message) {
		console.log(message.content + ' was deleted');
	},
};