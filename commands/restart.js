const config = require("../config.json");
const handleDatabaseError = require("../functions/handle-database-error.js");

module.exports = {
    commands: [
        "restart",
        "reboot"
    ],
    usage: "restart",
    description: "Restarts the bot.",
    category: "Developers",
    hidden: true,
    execute: (bot, r, msg, args) => {
        if (config.trusted.indexOf(msg.author.id) > -1) {
            if (args.length > 0) {
                if (isNaN(Number(args[0]))) return msg.channel.send({
                    embed: {
                        title: "Error!",
                        color: 0xE50000,
                        description: "`" + args[0] + "` isn't a valid number."
                    }
                });
                if (Number(args[0]) < 1) return msg.channel.send({
                    embed: {
                        title: "Error!",
                        color: 0xE50000,
                        description: "Shard IDs do not go below `1`."
                    }
                });
                if (Number(args[0]) > bot.shard.count) return msg.channel.send({
                    embed: {
                        title: "Error!",
                        color: 0xE50000,
                        description: "The bot does not have that many shards."
                    }
                });
                bot.shard.broadcastEval("(this.shard.id + 1) === " + args[0] + " && process.exit()").then(() => {
                    msg.channel.send({
                        embed: {
                            title: "Restarting...",
                            color: 3066993,
                            description: "Shard `#" + args[0] + "` is restarting."
                        }
                    });
                }).catch((e) => {
                    msg.channel.send({
                        embed: {
                            title: "Error!",
                            color: 3066993,
                            description: "Failed to kill shard `" + args[0] + "`."
                        }
                    });
                });
            } else {
                msg.channel.send({
                    embed: {
                        title: "Restarting...",
                        color: 3066993,
                        description: "All shards are currently restarting."
                    }
                }).then(() => {
                    bot.shard.broadcastEval("process.exit()").catch((e) => {
                        msg.channel.send({
                            embed: {
                                title: "Error!",
                                color: 3066993,
                                description: "Failed to exit a shard."
                            }
                        });
                    });
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