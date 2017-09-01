const config = require("../config.json");
const updateBotLists = require("../functions/update-sites.js");
const updatePresence = require("../functions/update-presence.js");

module.exports = (bot) => {
    bot.on("guildCreate", (server) => {
        server.data = {};
        server.data.prefix = config.prefix;
        if (server.defaultChannel) {
            server.defaultChannel.send("Thanks for adding me! So I'm guessing you're new to this game? If so, you're probably going to want to use the `" + config.prefix + "howtoplay` command to learn how to play. Just read the TL;DR at the bottom of the list if you're too lazy to read it all. If you're not new to this game, then have fun! If you find any bugs or have any feature requests, then join the official server using `" + config.prefix + "invite` and report it in the appropriate channels. Thank you for adding " + bot.user.username + ". Have fun!");
        }
        updateBotLists(bot);
        updatePresence(bot);
    });
};