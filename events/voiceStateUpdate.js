require('dotenv').config();
const { MessageEmbed } = require('discord.js');
const findLog = require('../database/findLog.js');

module.exports = {
	name: 'voiceStateUpdate',
	async execute(oldState, newState) {
        try {
            if (!newState.guild) return;
            const logType = 'voiceLog';
            const guild = newState.guild;
            const channelLog = await findLog.findLog(guild, logType);
            const generalLog = await findLog.findLog(guild, 'generalLog');
            const member = newState.member;
            const user = member.user;

            const embed = new MessageEmbed()
                .setColor(process.env.color)
                .setThumbnail(user.avatarURL({ dynamic: true }))
                .setDescription(`<@${user.id}>`)
                .setTimestamp()
                .setFooter('made with 🖤 by Suzan');

            if (oldState.channelId !== newState.channelId) {
                if (oldState.channelId === null) {
                    embed.setTitle('User joined voice chat')
                        .addField('Voice chat', `<#${newState.channelId}>`);

                    console.log(`'${user.tag}' joined '${newState.channel.name}' at '${guild.name}'`);

                    if (channelLog) {
                        await channelLog.send({ embeds: [embed] });
                    } else {
                        if (generalLog) await generalLog.send({ embeds: [embed] });
                    }
                } else if (newState.channelId === null) {
                    embed.setTitle('User left voice chat')
                        .addField('Voice chat', `<#${oldState.channelId}>`);

                    console.log(`'${user.tag}' left '${oldState.channel.name}' at '${guild.name}'`);

                    if (channelLog) {
                        await channelLog.send({ embeds: [embed] });
                    } else {
                        if (generalLog) await generalLog.send({ embeds: [embed] });
                    }
                } else {
                    embed.setTitle('User moved voice chat')
                        .addFields(
                            { name: 'Old voice chat', value: `<#${oldState.channelId}>`, inline: true },
                            { name: 'New voice chat', value: `<#${newState.channelId}>`, inline: true },
                        );

                    console.log(`'${user.tag}' moved from '${oldState.channel.name}' to '${newState.channel.name}' at '${guild.name}'`);

                    if (channelLog) {
                        await channelLog.send({ embeds: [embed] });
                    } else {
                        if (generalLog) await generalLog.send({ embeds: [embed] });
                    }
                }
            }

            if (oldState.deaf !== newState.deaf ||
                oldState.serverDeaf !== newState.serverDeaf) {
                if (newState.deaf) {
                    embed.setTitle('User deafen');

                    if (newState.serverDeaf) {
                        embed.addField('Deafen status', 'Server deafen');

                        console.log(`'${user.tag}' is server deafen at '${guild.name}'`);

                        if (channelLog) {
                            await channelLog.send({ embeds: [embed] });
                        } else {
                            if (generalLog) await generalLog.send({ embeds: [embed] });
                        }
                    } else if (newState.selfDeaf) {
                        embed.addField('Deafen status', 'Self deafen');

                        console.log(`'${user.tag}' is deafen`);

                        if (channelLog) {
                            await channelLog.send({ embeds: [embed] });
                        } else {
                            if (generalLog) await generalLog.send({ embeds: [embed] });
                        }
                    }
                } else if (oldState.deaf) {
                    embed.setTitle('User undeafen');

                    if (!newState.mute) {
                        embed.addField('Deafen status', 'Undeafen');

                        console.log(`'${user.tag}' is undeafen`);

                        if (channelLog) {
                            await channelLog.send({ embeds: [embed] });
                        } else {
                            if (generalLog) await generalLog.send({ embeds: [embed] });
                        }
                    } else {
                        embed.addField('Deafen status', 'Undeafen but mute');

                        console.log(`'${user.tag}' is undeafen but mute`);

                        if (channelLog) {
                            await channelLog.send({ embeds: [embed] });
                        } else {
                            if (generalLog) await generalLog.send({ embeds: [embed] });
                        }
                    }
                }
            }

            if (oldState.selfMute !== newState.selfMute ||
                oldState.serverMute !== newState.serverMute) {
                const embed1 = new MessageEmbed()
                    .setColor('#00FFE9')
                    .setThumbnail(user.avatarURL({ dynamic: true }))
                    .setDescription(`<@${user.id}>`)
                    .setTimestamp()
                    .setFooter('made with 🖤 by Suzan');

                if (newState.mute) {
                    embed1.setTitle('User mute');

                    if (newState.serverMute) {
                        embed1.addField('Mute status', 'Server mute');

                        console.log(`'${user.tag}' is server mute at '${guild.name}'`);

                        if (channelLog) {
                            await channelLog.send({ embeds: [embed1] });
                        } else {
                            if (generalLog) await generalLog.send({ embeds: [embed1] });
                        }
                    } else if (newState.selfMute) {
                        embed1.addField('Mute status', 'Self mute');

                        console.log(`'${user.tag}' is mute`);

                        if (channelLog) {
                            await channelLog.send({ embeds: [embed1] });
                        } else {
                            if (generalLog) await generalLog.send({ embeds: [embed1] });
                        }
                    }
                } else if (oldState.mute) {
                    embed1.setTitle('User unmute')
                        .addField('Mute status', 'Unmute');

                    console.log(`'${user.tag}' is unmute`);

                    if (channelLog) {
                        await channelLog.send({ embeds: [embed1] });
                    } else {
                        if (generalLog) await generalLog.send({ embeds: [embed1] });
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
	},
};