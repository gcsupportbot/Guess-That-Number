const config = require("../config.json");

module.exports = {
    commands: [
        "donate",
        "patreon",
        "paypal"
    ],
    usage: "donate",
    description: "Get the donation links to support the creator.",
    category: "General",
    hidden: false,
    execute: (bot, database, msg, args) => {
        msg.channel.send({
            embed: {
                title: "Donation Links",
                color: 3066993,
                description: "Donating to PassTheMayo will help pay for the VPS that keeps the bots alive. For now, the only available methods is through Patreon, since I'd prefer to keep my home address private, by disabling PayPal.",
                fields: [
                    {
                        name: "Patreon",
                        value: config.links.patreon,
                        inline: true
                    }
                ]
            }
        });
    }
};