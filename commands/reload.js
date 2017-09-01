const path = require("path");
const config = require("../config.json");
const fs = require("fs");
const util = require("util");

module.exports = {
    commands: [
        "reload"
    ],
    description: "Reloads a command from the filesystem.",
    usage: "reload <command | file>",
    category: "Developers",
    hidden: true,
    execute: (bot, r, msg, args) => {
        if (config.trusted.indexOf(msg.author.id) > -1) {
            if (args.length > 0) {
                if (args[0] === "all") {
                    var commands = fs.readdir(__dirname + "/", (error, files) => {
                        if (error) return msg.channel.send({
                            embed: {
                                title: "Error!",
                                color: 0xE50000,
                                description: "An unexpected error occured while reading commands directory."
                            }
                        });
                        files.forEach((c) => {
                            delete require.cache[path.normalize(__dirname + "/" + c)];
                            try {
                                bot.commands[c.replace(/\..*/g, "")] = require(path.normalize(__dirname + "/" + c));
                                if (files.indexOf(c) === files.length - 1) {
                                    msg.channel.send({
                                        embed: {
                                            title: "Reloaded!",
                                            color: 3066993,
                                            description: "Successfully reloaded all commands."
                                        }
                                    });
                                }
                            } catch (e) {
                                msg.channel.send({
                                    embed: {
                                        title: "Error!",
                                        color: 0xE50000,
                                        description: "An error occured while trying to reload command.\n```js\n" + util.inspect(e) + "```"
                                    }
                                });
                            }
                        });
                    });
                } else {
                    var check = Object.keys(bot.commands).filter((c) => bot.commands[c].commands.indexOf(args[0]) > -1);
                    if (check.length > 0) {
                        delete require.cache[__dirname + "/" + check[0] + ".js"];
                        try {
                            bot.commands[check[0]] = require(__dirname + "/" + check[0] + ".js");
                            msg.channel.send({
                                embed: {
                                    title: "Reloaded!",
                                    color: 3066993,
                                    description: "Command `" + bot.commands[check[0]].commands[0] + "` has been reloaded."
                                }
                            });
                        } catch (e) {
                            msg.channel.send({
                                embed: {
                                    title: "Error!",
                                    color: 0xE50000,
                                    description: "An error occured while trying to reload command.\n```js\n" + util.inspect(e) + "```"
                                }
                            });
                        }
                    } else {
                        fs.readdir(__dirname, (error, files) => {
                            if (error) return msg.channel.send({
                                embed: {
                                    title: "Error!",
                                    color: 0xE50000,
                                    description: "An unexpected error occured while reading commands directory."
                                }
                            });
                            if (files.indexOf(args[0] + ".js") < 0) return msg.channel.send({
                                embed: {
                                    title: "Error!",
                                    color: 0xE50000,
                                    description: "Unknown command, `" + args[0] + "`."
                                }
                            });
                            delete require.cache[__dirname + "/" + args[0] + ".js"];
                            try {
                                bot.commands[args[0]] = require(__dirname + "/" + args[0] + ".js");
                                msg.channel.send({
                                    embed: {
                                        title: "Reloaded!",
                                        color: 3066993,
                                        description: "Command `" + bot.commands[args[0]].commands[0] + "` has been reloaded."
                                    }
                                });
                            } catch (e) {
                                msg.channel.send({
                                    embed: {
                                        title: "Error!",
                                        color: 0xE50000,
                                        description: "An error occured while trying to reload command.\n```js\n" + util.inspect(e) + "```"
                                    }
                                });
                            }
                        });
                    }
                }
            } else {
                msg.channel.send({
                    embed: {
                        title: "Error!",
                        color: 0xE50000,
                        description: "Missing `<command | file>` option."
                    }
                });
            }
        } else {
            msg.channel.send({
                embed: {
                    title: "Error!",
                    color: 0xE50000,
                    description: "You do not have permission to execute this command."
                }
            });
        }
    }
};