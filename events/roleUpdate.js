require('dotenv').config();
const { MessageEmbed } = require('discord.js');
const findLog = require('../database/findLog.js');

module.exports = {
    name: 'roleUpdate',
    async execute(oldRole, newRole) {
        try {
            if (!newRole.guild) return;
            const logType = 'roleLog';
            const guild = newRole.guild;
            const channelLog = await findLog.findLog(guild, logType);
            const generalLog = await findLog.findLog(guild, 'generalLog');
            const fetchedLogs = await guild.fetchAuditLogs({ limit: 1, type: 'ROLE_UPDATE' });
            const executor = fetchedLogs.entries.first().executor;
            //const executor = createLog.executor;

            const embed = new MessageEmbed()
                .setColor(process.env.color)
                .setThumbnail(executor.avatarURL({ dynamic: true }))
                .setDescription(`<@&${newRole.id}>`)
                .setTimestamp()
                .setFooter('made with 🖤 by Suzan');

            if (oldRole.name !== newRole.name) {
                embed.setTitle('Role name updated')
                    .setFields(
                        { name: 'Old name', value: oldRole.name, inline: true },
                        { name: 'New name', value: newRole.name, inline: true },
                        { name: 'Renamed by', value: `<@${executor.id}>` },
                    );

                console.log(`'${executor.tag}' changed the role '${newRole.name}' name at '${guild.name}'`);

                if (channelLog) {
                    await channelLog.send({ embeds: [embed] });
                } else {
                    if (generalLog) await generalLog.send({ embeds: [embed] });
                }

                const connection = await require('../database/db.js');
                const sql = `SELECT * FROM mod_roles WHERE id = '${oldRole.id}'`;
                let isUpdatable = false;
                await connection.query(sql).then(result => {
                    if (result[0][0]) isUpdatable = true;
                }).catch(console.log);

                if (isUpdatable) {
                    const sql1 = `UPDATE mod_roles SET name = '${newRole.name}' WHERE mod_roles.id = '${oldRole.id}'`;
                    await connection.query(sql1).catch(console.log);
                }
            } else if (oldRole.color !== newRole.color) {
                embed.setTitle('Role color updated')
                    .setFields(
                        { name: 'Old color', value: `${oldRole.color}`, inline: true },
                        { name: 'New color', value: `${newRole.color}`, inline: true },
                        { name: 'Changed by', value: `<@${executor.id}>` },
                    );

                console.log(`'${executor.tag}' changed the role '${newRole.name}' color at '${guild.name}'`);

                if (channelLog) {
                    await channelLog.send({ embeds: [embed] });
                } else {
                    if (generalLog) await generalLog.send({ embeds: [embed] });
                }
            }/* else if (oldRole.permissions !== newRole.permissions) {
                embed.setTitle('Role permissions updated')
                    .setFields(
                        { name: 'Changed by', value: `<@${executor.id}>` },
                    );

                console.log(`'${executor.tag}' changed the role '${newRole.name}' permissions at '${guild.name}'`);

                if (channelLog) {
                    await channelLog.send({ embeds: [embed] });
                } else {
                    if (generalLog) await generalLog.send({ embeds: [embed] });
                }
            } */
            
        } catch (error) {
            console.log(error);
        }
    },
};