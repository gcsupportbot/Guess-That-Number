const updateBotLists = require("../functions/update-sites.js");
const updatePresence = require("../functions/update-presence.js");

module.exports = (bot) => {
    bot.on("guildDelete", (server) => {
        updateBotLists(bot);
        updatePresence(bot);
    });
};