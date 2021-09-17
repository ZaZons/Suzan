const { noMentionRoleName } = require('../config.json');

module.exports = {
    name: 'messageCreate',
    async execute(message)
    {
        if (!message.guild) return;
        if (message.author.bot) return;

        const noMentionRole = message.guild.roles.cache.find(r => r.name === noMentionRoleName);
        const mentionsLimit = 5;
        const userMentions = message.mentions.members;
        const roleMentions = message.mentions.roles;
        const mentionsSize = userMentions.size + roleMentions.size;

        if (mentionsSize > 0)
        {
            if (mentionsSize >= mentionsLimit)
            {
                message.delete();
                message.channel.send('You can\'t mention that much people in a single message');
                return;
            }
            else
            {
                const noMention = userMentions.find(u => u.roles.cache.find(r => r === noMentionRole));

                if (noMention)
                {
                    message.delete();
                    message.channel.send('You can\'t mention that person');
                    return;
                }

                const role = roleMentions.find(r => r === noMentionRole);

                if (role)
                {
                    message.delete();
                    message.channel.send('You can\'t mention that role');
                    return;
                }
            }
        }
    },
};