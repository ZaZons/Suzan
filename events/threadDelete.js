/* const fs = require('fs');
const { MessageEmbed } = require('discord.js');
const { logChannelTopic } = require('../config.json');
const unarchiveThreadsFile = require('../files/whitelistedThreads.json');

module.exports = {
    name: 'threadDelete',
    async execute(thread) {
        try {
            const guild = thread.guild;
            const channels = guild.channels.cache;
            const logChannel = channels.find(c => c.topic === logChannelTopic);
            const fetchedLogs = await guild.fetchAuditLogs({ limit: 1, type: 'THREAD_DELETE' });
            const createdLog = fetchedLogs.entries.first();
            const deleter = createdLog.executor;
            const unarchivableThreads = unarchiveThreadsFile.whitelistedThreads;

            const embed = new MessageEmbed()
                .setColor('#00FFE9')
                .setTitle('Thread deleted')
                .setThumbnail(deleter.avatarURL({ dynamic: true }))
                .setDescription(`<#${thread.id}>`)
                .addFields(
                    { name: 'Parent channel', value: `<#${thread.parentId}>`, inline: true },
                    { name: 'Parent category', value: `<#${thread.parent.parentId}>`, inline: true },
                    { name: 'Deleted by', value: `<@${deleter.id}>` },
                )
                .setTimestamp()
                .setFooter('made with 🖤 by Suzan');

            unarchivableThreads.forEach(function(result, index)
            {
                if (result.id === thread.id)
                {
                    unarchivableThreads.splice(index, 1);

                    fs.writeFile('./files/whitelistedThreads.json', JSON.stringify(unarchiveThreadsFile, null, 4), function(err)
                    {
                        if (err) throw err;
                    });
                }
            });

            if (logChannel) await logChannel.send({ embeds: [embed] });
            console.log(`'#${thread.name}' thread was deleted at '${guild.name}' by '${deleter.tag}'.`);
        }
        catch (error)
        {
            console.log(error);
        }
    },
}; */