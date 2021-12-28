require('dotenv').config();
const checkBanned = require('../database/checkBannedMySQL.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const findLog = require('../database/findLog.js');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-unarchivable')
        .setDescription('Sets a thread as unarchivable (when discord archives it, the bot unarchives it)')
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
                .setTitle('Thread set to unarchivable')
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
            const sql = `INSERT INTO whitelisted_threads VALUES ('${thread.id}', '${thread.name}', '${guild.id}')`;
            await connection.query(sql).catch(console.log);

            await interaction.reply('Thread set to unarchivable successfully');

            const logType = 'channelLog';
            const channelLog = await findLog.findLog(guild, logType);
            if (channelLog) {
                await channelLog.send({ embeds: [embed] });
            } else {
                const generalLog = await findLog.findLog(guild, 'generalLog');
                if (generalLog) await generalLog.send({ embeds: [embed] });
            }
        } catch (error) {
            console.log(error);
        }
    },
};