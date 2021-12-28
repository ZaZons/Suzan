require('dotenv').config();
const { MessageEmbed } = require('discord.js');
const findLog = require('../database/findLog.js');

module.exports = {
    name: 'threadCreate',
    async execute(thread) {
        try {
            if (!thread.guild) return;
            const logType = 'channelLog';
            const guild = thread.guild;
            const fetchedLogs = await guild.fetchAuditLogs({ limit: 1, type: 'THREAD_CREATE' });
            const creator = fetchedLogs.entries.first().executor;
            //const creator = createdLog.executor;

            const embed = new MessageEmbed()
                .setColor(process.env.color)
                .setTitle('Thread created')
                .setThumbnail(creator.avatarURL({ dynamic: true }))
                .setDescription(`<#${thread.id}>`)
                .addFields(
                    { name: 'Parent channel', value: `<#${thread.parentId}>`, inline: true },
                    { name: 'Parent category', value: `<#${thread.parent.parentId}>`, inline: true },
                    { name: 'Created by', value: `<@${creator.id}>` },
                )
                .setTimestamp()
                .setFooter('made with 🖤 by Suzan');

            console.log(`'#${thread.name}' thread was created at '${guild.name}' by '${creator.tag}'.`);

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