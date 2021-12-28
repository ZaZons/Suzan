module.exports = {
	data: {
		name: 'join-thread'
	},

	async execute(interaction) {
		try {
			let threadId = interaction.customId;
			if (threadId.startsWith('j')) {
				threadId = threadId.substr(1, threadId.length);
				const threadChannel = await interaction.guild.channels.cache.get(threadId);
				if (!threadChannel) {
					await interaction.deferUpdate();
					return;
				}
				if (threadChannel) threadChannel.members.add(interaction.user.id);
				await interaction.deferUpdate();
				//await interaction.reply({ content: `You joined ${threadChannel.name}`, ephemeral: true });
			}
			if (threadId.startsWith('l')) {
				threadId = threadId.substr(1, threadId.length);
				const threadChannel = await interaction.guild.channels.cache.get(threadId);
				if (!threadChannel) {
					await interaction.deferUpdate();
					return;
				}
				threadChannel.members.remove(interaction.user.id);
				await interaction.deferUpdate();
				//await interaction.reply({ content: `You left ${threadChannel.name}`, ephemeral: true });
			}
		} catch (error) {
			console.log(error);
		}
	}
}