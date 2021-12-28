/* const usersMap = new Map();
const { mutedRole } = require('../config.json');

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        try {
            if (!message.guild) return;
            if (message.author.bot) return;
            const muteRole = message.guild.roles.cache.find(r => r.name === mutedRole);
            if (!muteRole) return;
            const limit = 5;
            const diff = 2000;
            const time = 5000;
            const reset = 750;

            if (usersMap.has(message.author.id)) {
                const userData = usersMap.get(message.author.id);
                const { lastMessage, timer } = userData;
                const difference = message.createdTimestamp - lastMessage.createdTimestamp;
                let msgCount = userData.msgCount;

                if (difference > diff) {
                    clearTimeout(timer);
                    userData.msgCount = 1;
                    userData.message = message;
                    userData.timer = setTimeout(() => {
                        usersMap.delete(message.author.id);
                    }, reset);
                    usersMap.set(message.author.id, userData);
                } else {
                    msgCount++;
                    if (msgCount === limit) {
                        message.member.roles.add(muteRole);
                        message.channel.send('You cannot spam in this chat');
                        message.channel.bulkDelete(msgCount);
                    } else {
                        userData.msgCount = msgCount;
                        usersMap.set(message.author.id, userData);
                    }
                }
            } else {
                const fn = setTimeout(() => {
                    usersMap.delete(message.author.id);
                }, time);

                usersMap.set(message.author.id, {
                    msgCount: 1,
                    lastMessage: message,
                    timer: fn,
                });
            }
        } catch (error) {
            console.log(error);
        }
    },
}; */