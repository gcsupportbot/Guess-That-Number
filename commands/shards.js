module.exports = {
    commands: [
        "shards"
    ],
    usage: "shards",
    description: "Shows a list of shards and their stats.",
    category: "Information",
    hidden: false,
    execute: (bot, r, msg, args) => {
        bot.shard.broadcastEval("[(this.shard.id + 1), this.guilds.size, this.users.size, Math.round(this.ping) + \"ms\", (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1) + \" MB\"]").then(r => {
            msg.channel.send({
                embed: {
                    title: "Shards",
                    description: "Each of these values is a shard within the bot, containing a portion of servers.",
                    color: 3066993,
                    fields: r.map(v => {
                        return {
                            name: "Shard #" + v[0],
                            value: "**Servers**: " + v[1] + "\n**Users**: " + v[2] + "\n**Ping**: " + v[3] + "\n**Memory Usage**: " + v[4],
                            inline: false
                        };
                    })
                }
            });
        }).catch(error => {
            msg.channel.send({
                embed: {
                    title: "Error!",
                    color: 0xE50000,
                    description: "An error occured while getting shards information."
                }
            });
            console.error(error);
        });
    }
};