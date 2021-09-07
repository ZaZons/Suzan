const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const ytdl = require('ytdl-core');
const {
	AudioPlayerStatus,
	StreamType,
	createdAudioPlayer,
	createAudioResource,
	joinVoiceChannel,
} = require('@discordjs/voice');
const { execute } = require('./userInfo');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Plays a song'),
	async execute(interaction) {
		const guild = interaction.guild;
		const channel = guild.member.voiceState.channelid;
		console.log(channel);
	},
};