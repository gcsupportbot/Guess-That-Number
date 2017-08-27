const config = require("../config.json");

module.exports = {
    commands: [
        "help"
    ],
    usage: "help [command]",
    description: "View the help list.",
    category: "Information",
    hidden: false,
    execute: (bot, database, msg, args) => {
        let commands;
        if (config.trusted.indexOf(msg.author.id) > -1) {
            commands = Object.keys(bot.commands);
        } else {
            commands = Object.keys(bot.commands).filter(c => !bot.commands[c].hidden);
        }
        commands.sort((a, b) => a < b);
        if (args.length > 0) {
            if ([].concat.apply([], Object.keys(bot.commands).map(c => bot.commands[c].commands)).indexOf(args[0]) > -1) {
                commands.forEach((command) => {
                    if (bot.commands[command].commands.indexOf(args[0]) > -1) {
                        msg.channel.send({
                            embed: {
                                title: bot.commands[command].commands[0],
                                description: bot.commands[command].description,
                                color: 3066993,
                                fields: [
                                    {
                                        name: "Usage",
                                        value: bot.commands[command].usage,
                                        inline: false
                                    },
                                    {
                                        name: "Category",
                                        value: bot.commands[command].category,
                                        inline: false
                                    }
                                ]
                            }
                        });
                    }
                });
            } else {
                msg.channel.send({
                    embed: {
                        title: "Unknown command!",
                        color: 0xE50000,
                        description: "`" + args.join(" ") + "` is not a command that I know of."
                    }
                });
            }
        } else {
            let fields = [];
            commands.forEach(c => {
                let filter = fields.filter(f => f.name === bot.commands[c].category);
                if (filter.length > 0) {
                    fields[fields.indexOf(filter[0])].value += ", `" + bot.commands[c].commands[0] + "`";
                } else {
                    fields[fields.length] = {
                        name: bot.commands[c].category,
                        value: "`" + bot.commands[c].commands[0] + "`",
                        inline: false
                    };
                }
            });
            fields.sort((a, b) => {
                if (a.name.toUpperCase() < b.name.toUpperCase()) {
                    return -1;
                }
                if (a.name.toUpperCase() > b.name.toUpperCase()) {
                    return 1;
                }
                return 0;
            });
            msg.channel.send({
                embed: {
                    title: "Command List",
                    description: "To view specific information about a command, run `" + ((msg.guild) ? msg.guild.data.prefix : config.prefix) + "help <command>`.",
                    color: 3066993,
                    fields
                }
            });
        }
    }
};