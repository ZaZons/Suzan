const { MessageEmbed } = require('discord.js');
const { logChannelTopic } = require('../config.json');

module.exports = {
    name: 'roleUpdate',
    async execute(oldRole, newRole)
    {
        if (!newRole.guild) return;
        const guild = newRole.guild;
        const channels = guild.channels.cache;
        const logChannel = channels.find(c => c.topic === logChannelTopic);
        const fetchedLogs = await guild.fetchAuditLogs({ limit: 1, type: 'ROLE_UPDATE' });
        const createLog = fetchedLogs.entries.first();
        const executor = createLog.executor;
        const embed = new MessageEmbed()
            .setColor('#00FFE9')
            .setAuthor(executor.tag, executor.avatarURL())
            .setTimestamp();

        if (oldRole.name !== newRole.name)
        {
            embed.setTitle('Role name changed')
                .setDescription(`${oldRole.name} ► ${newRole.name}`);

            if (logChannel) logChannel.send({ embeds: [embed] });
            console.log(`'${executor.tag}' chenged the role '${newRole.name}' 
            name at '${guild.name}'`);
        }

        if (oldRole.color !== newRole.color)
        {
            embed.setTitle('Role color changed')
                .setDescription(`${oldRole.color} ► ${newRole.color}`);

            if (logChannel) logChannel.send({ embeds: [embed] });
            console.log(`'${executor.tag}' chenged the role '${newRole.name}' 
            color at '${guild.name}'`);
        }
/*
        if (oldRole.permissions !== newRole.permissions)
        {
            console.log('permissions changed');
        }*/
    },
};