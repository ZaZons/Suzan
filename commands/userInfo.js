const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Replies with user info')
		.addUserOption(option =>
			option.setName('user')
				.setDescription('Replies with other user info')
				.setRequired(false)),
	async execute(interaction) {
		const guild = interaction.guild;
		guild.fetch();
		const option = interaction.options;
		const optionMember = option.getMember('user');
		const user = interaction.user;
		let chosenMember = interaction.member;
		let chosenUser = user;
		if (optionMember !== null) {
			chosenUser = optionMember.user;
			chosenMember = optionMember;
		}
		const createdAt = chosenUser.createdAt.toString();
		const userCreated = createdAt.slice(4, 15);
		const joinedAt = chosenMember.joinedAt.toString();
		const userJoined = joinedAt.slice(4, 15);
		let nickname = chosenMember.nickname;
		if (nickname === null) {
			nickname = chosenUser.username;
		}
		let type;
		if (chosenUser.bot === true) {
			type = 'Beep boop (Bot)';
		}
		else {
			type = 'Hooman';
		}
		const embed = new MessageEmbed()
			.setColor('#00FFE9')
			.setThumbnail(chosenUser.avatarURL({ dynamic: true }))
			.setTitle(nickname)
			.addFields(
				{ name: 'Username', value: chosenUser.tag, inline: true },
				{ name: 'Type', value: type, inline: true },
				{ name: 'User ID', value: chosenUser.id },
				{ name: 'Joined Discord at', value: userCreated, inline: true },
				{ name: `Joined ${guild} at`, value: userJoined, inline: true },
			)
			.setFooter('made with 🖤 by Suzan');
		console.log(`${user.tag} asked for user info about '${ chosenUser.tag }' in '#${ interaction.channel.name }' at '${ guild.name }'.`);
		await interaction.reply({ embeds: [embed] });
	},
};
