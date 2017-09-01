const config = require("../config.json");

module.exports = {
    commands: [
        "upvote",
        "updoot"
    ],
    usage: "upvote",
    description: "Upvote the bot on popular bot lists.",
    category: "General",
    hidden: false,
    execute: (bot, r, msg, args) => {
        msg.channel.send({
            embed: {
                title: "Upvote",
                color: 3066993,
                description: "Upvoting serves no real purpose, but it is nice to see how many people like my bot. If you do really enjoy my bot, then click any of the links below and login to the site with Discord. Once you do that, click the 'Upvote' button on the bot page.",
                fields: [
                    {
                        name: "Discord Bot List",
                        value: config.links["discordbots.org"],
                        inline: true
                    }
                ]
            }
        });
    }
};