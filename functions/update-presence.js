const config = require("../config.json");

module.exports = (bot) => {
    bot.shard.fetchClientValues("guilds.size").then((guilds) => {
        bot.user.setPresence({
            game: {
                name: guilds.reduce((a, b) => a + b, 0) + " Servers | " + config.prefix + "help",
                type: 0
            }
        });
    });
};