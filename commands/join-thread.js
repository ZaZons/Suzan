require('dotenv').config();
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const checkBanned = require('../database/checkBannedMySQL.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('join-thread')
		.setDescription('User joins a selected thread')
		.addStringOption(option =>
			option.setName('thread')
			.setDescription('Thread to join')
			.setRequired(true)),

	async execute(interaction) {
		try {
			const banned = await checkBanned.checkBannedUser(interaction.member);
			if (banned) {
				await interaction.reply('You can\'t use this bot, you\'re blocked');
				return;
			}

			const guild = interaction.guild;
			const threadName = interaction.options.getString('thread');
			const threadChannel = await guild.channels.cache.find(c => c.name === threadName);
			if (!threadChannel || threadChannel.type !== 'GUILD_PUBLIC_THREAD') {
				await interaction.reply('Please select a thread and try again');
				return;
			}

			const embed = new MessageEmbed()
				.setColor(process.env.color)
				.setTitle(threadChannel.name)
				.setDescription(`A thread to talk about ${threadChannel.name}`)
				.addField('Parent channel', threadChannel.parent.name)
				.setTimestamp()
				.setFooter('made with 🖤 by Suzan');

			const row = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId(`j${threadChannel.id}`)
						.setLabel('Join thread')
						.setStyle('SUCCESS'),

					new MessageButton()
						.setCustomId(`l${threadChannel.id}`)
						.setLabel('Leave thread')
						.setStyle('DANGER'),
				);

			await interaction.reply({embeds: [embed], components: [row] });
			/* const filter = (btnInteraction) => btnInteraction.customId === row.components[0] || row.components[1] && btnInteraction.user.id === interaction.user.id;
			const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15_000 });
			await collector.on('collect', i => {
				try {
					if (i.customId === 'joinThread') {
						threadChannel.members.add(i.user.id);
						i.reply({ content: `You joined ${threadChannel.name}`, ephemeral: true});
					}
					if (i.customId === 'leaveThread') {
						threadChannel.members.remove(i.user.id);
						i.reply({ content: `You left ${threadChannel.name}`, ephemeral: true});
					}
				} catch (error) {
					console.log(error);
				} 
			});
			await collector.on('end', collected => {
				interaction.editReply({embeds: [embed], components: []});
			}); */
		} catch (error) {
			console.log(error);
		}
	}
}