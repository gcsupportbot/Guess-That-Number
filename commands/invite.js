const config = require("../config.json");

module.exports = {
    commands: [
        "invite",
        "inv"
    ],
    usage: "invite",
    description: "Invite this bot to your server.",
    category: "General",
    hidden: false,
    execute: (bot, r, msg, args) => {
        msg.channel.send({
            embed: {
                title: "Invite Links",
                description: "You can invite the bot using the 'Bot Invite' link or you can join the official support server using the 'Official Server' link.",
                color: 3066993,
                fields: [
                    {
                        name: "Bot Invite",
                        value: config.links.bot,
                        inline: true
                    },
                    {
                        name: "Official Server",
                        value: config.links.server,
                        inline: true
                    }
                ]
            }
        });
    }
};