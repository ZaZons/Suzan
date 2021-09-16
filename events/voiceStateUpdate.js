/* eslint-disable indent */
const { MessageEmbed } = require('discord.js');
const { logChannelTopic } = require('../config.json');

module.exports = {
	name: 'voiceStateUpdate',
	async execute(oldState, newState)
    {
		const guild = newState.guild;
        const member = newState.member;
        const user = member.user;
		const channels = guild.channels.cache;
		const logChannel = channels.find(c => c.topic === logChannelTopic);
        const embed = new MessageEmbed()
            .setColor('#00FFE9')
            .setAuthor(user.tag, user.avatarURL())
            .setTimestamp();

		if (oldState.channelId !== newState.channelId)
        {
			if (oldState.channelId === null)
            {
                embed.setTitle('User joined voice chat')
                    .setDescription(`<#${newState.channelId}>`);

                console.log(`'${user.tag}' joined '${newState.channel.name}' at '${guild.name}'`);
                if (logChannel) logChannel.send({ embeds: [embed] });
			}
            else if (newState.channelId === null)
            {
                embed.setTitle('User left voice chat')
                    .setDescription(`<#${oldState.channelId}>`);

                console.log(`'${user.tag}' left '${oldState.channel.name}' at '${guild.name}'`);
                if (logChannel) logChannel.send({ embeds: [embed] });
			}
            else
            {
                embed.setTitle('User moved voice chat')
                    .setDescription(`<#${oldState.channelId}> ► <#${newState.channelId}>`);

                console.log(`'${user.tag}' moved from '${oldState.channel.name}' to '${newState.channel.name}' at '${guild.name}'`);
                if (logChannel) logChannel.send({ embeds: [embed] });
			}
        }
        if (oldState.deaf !== newState.deaf || oldState.serverDeaf !== newState.serverDeaf)
        {
            if (newState.deaf)
            {
                embed.setTitle('User deafen');
                if (newState.serverDeaf)
                {
                    embed.setDescription('Server deafen');

                    console.log(`'${user.tag}' is server deafen at '${guild.name}'`);
                    if (logChannel) logChannel.send({ embeds: [embed] });
                }
                else if (newState.selfDeaf)
                {
                    embed.setDescription('Self deafen');

                    console.log(`'${user.tag}' is deafen`);
                    if (logChannel) logChannel.send({ embeds: [embed] });
                }
            }
            else if (oldState.deaf)
            {
                embed.setTitle('User undeafen');
                if (!newState.mute)
                {
                    embed.setDescription('Undeafen');

                    console.log(`'${user.tag}' is undeafen`);
                    if (logChannel) logChannel.send({ embeds: [embed] });
                }
                else
                {
                    embed.setDescription('Undeafen but mute');

                    console.log(`'${user.tag}' is undeafen but mute`);
                    if (logChannel) logChannel.send({ embeds: [embed] });
                }
            }
        }
        if (oldState.selfMute !== newState.selfMute ||
            oldState.serverMute !== newState.serverMute)
        {
            const embed1 = new MessageEmbed()
                .setColor('#00FFE9')
                .setAuthor(user.tag, user.avatarURL())
                .setTimestamp();

            if (newState.mute)
            {
                embed1.setTitle('User mute');

                if (newState.serverMute)
                {
                    embed1.setDescription('Server mute');

                    console.log(`'${user.tag}' is server mute at '${guild.name}'`);
                    if (logChannel) logChannel.send({ embeds: [embed1] });
                }
                else if (newState.selfMute)
                {
                    embed1.setDescription('Self mute');

                    console.log(`'${user.tag}' is mute`);
                    if (logChannel) logChannel.send({ embeds: [embed1] });
                }
            }
            else if (oldState.mute)
            {
                embed1.setTitle('User unmute');

                console.log(`'${user.tag}' is unmute`);
                if (logChannel) logChannel.send({ embeds: [embed1] });
            }
        }
	},
};