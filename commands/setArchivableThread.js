require('dotenv').config();
const checkBanned = require('../database/checkBannedMySQL.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const findLog = require('../database/findLog.js');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-archivable')
        .setDescription('Sets a thread as archivable (when discord archives it, the bot will no longer unarchive it)')
        .addChannelOption(option =>
            option.setName('thread')
                .setDescription('Select a thread')
                .setRequired(true)),

    async execute(interaction) {
        try {
            const banned = await checkBanned.checkBannedUser(interaction.member);
            if (banned) {
                await interaction.reply('You can\'t use this bot, you\'re blocked');
                return;
            }

            const thread = interaction.options.getChannel('thread');
            if (!thread.isThread()) {
                await interaction.reply('Select a thread and try again');
                return;
            }

            const guild = interaction.guild;
            const embed = new MessageEmbed()
                .setColor(process.env.color)
                .setTitle('Thread set to archivable')
                .setThumbnail(interaction.user.avatarURL({ dynamic: true }))
                .setDescription(`<#${thread.id}>`)
                .addFields(
                    { name: 'Parent channel', value: `<#${thread.parentId}>`, inline: true },
                    { name: 'Parent category', value: `<#${thread.parent.parentId}>`, inline: true },
                    { name: 'Set by', value: `<@${interaction.user.id}>` },
                )
                .setTimestamp()
                .setFooter('made with 🖤 by Suzan');

            const connection = await require('../database/db.js');
            const sql = `DELETE FROM whitelisted_threads WHERE id = '${thread.id}'`;
            await connection.query(sql).catch(console.log);

            const logType = 'channelLog';
            const channelLog = await findLog.findLog(guild, logType);
            if (channelLog) {
                await channelLog.send({ embeds: [embed] });
            } else {
                const generalLog = await findLog.findLog(guild, 'generalLog');
                if (generalLog) await generalLog.send({ embeds: [embed] });
            }

            await interaction.reply('Thread set to archivable successfully');
        } catch (error) {
            console.log(error);
        }
    },
};