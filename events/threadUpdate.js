require('dotenv').config();
const { MessageEmbed } = require('discord.js');
const findLog = require('../database/findLog.js');

module.exports = {
    name: 'threadUpdate',
    async execute(oldThread, newThread) {
        try {
            const guild = newThread.guild;
            const fetchedLogs = await guild.fetchAuditLogs({ limit: 1, type: 'THREAD_UPDATE' });
            let executor;
            if (fetchedLogs) executor = fetchedLogs.entries.first().executor;
            //const { executor } = updateLog;
            const logType = 'channelLog';
            const channelLog = await findLog.findLog(guild, logType);
            const generalLog = await findLog.findLog(guild, 'generalLog');

            const embed = new MessageEmbed()
                .setColor(process.env.color)
                .setThumbnail(executor.avatarURL({ dynamic: true }))
                .setDescription(`<#${newThread.id}>`)
                .setTimestamp()
                .setFooter('Made with 🖤 by Suzan');

            if (oldThread.name !== newThread.name) {
                embed.setTitle('Thread name updated')
                    .addFields(
                        { name: 'Old name', value: oldThread.name, inline: true },
                        { name: 'New name', value: newThread.name, inline: true },
                        { name: 'Renamed by', value: `<@${executor.id}>` },
                    );

                if (channelLog) {
                    await channelLog.send({ embeds: [embed] });
                } else if (generalLog) {
                    await channelLog.send({ embeds: [embed] });
                }
                console.log(`'${newThread.name}' thread name changed in '${newThread.parent.name}' at '${guild.name}'`);


                const connection = await require('../database/db.js');
                const sql = `SELECT * FROM whitelisted_threads WHERE id = '${oldThread.id}'`;
                let isUpdatable = false;
                await connection.query(sql).then(result => {
                    if (result[0][0]) isUpdatable = true;
                }).catch(console.log);

                if (isUpdatable) {
                    const sql1 = `UPDATE whitelisted_threads SET name = '${newThread.name}' WHERE whitelisted_threads.id = '${oldThread.id}'`;
                    await connection.query(sql1).catch(console.log);
                }
            } else if (oldThread.archived !== newThread.archived) {
                if (newThread.archived) {
                    embed.setTitle('Thread archived')
                        .addField('Archived by', `<@${executor.id}>`);

                    let isUnarchivable = false;
                    const connection = await require('../database/db.js');
                    const sql = `SELECT * FROM whitelisted_threads WHERE id = '${newThread.id}'`;
                    await connection.query(sql).then(result => {
                        if (result[0][0]) isUnarchivable = result[0][0].id == newThread.id ? true : false;
                    });

                    if (isUnarchivable) newThread.setArchived(false);

                    console.log(`'${newThread.name}' thread archived in '${newThread.parent.name}' at '${guild.name}'`);
                    if (channelLog) {
                        await channelLog.send({ embeds: [embed] });
                    } else if (generalLog) {
                        await channelLog.send({ embeds: [embed] });
                    }
                    return;
                } else {
                    embed.setTitle('Thread unarchived')
                        .addField('Unarchived by', `<@${executor.id}>`);

                    console.log(`'${newThread.name}' thread unarchived in '${newThread.parent.name}' at '${guild.name}'`);
                    if (channelLog) {
                        await channelLog.send({ embeds: [embed] });
                    } else if (generalLog) {
                        await channelLog.send({ embeds: [embed] });
                    }
                    return;
                }
            }
        } catch (error) {
            console.log(error);
        }
    },
};