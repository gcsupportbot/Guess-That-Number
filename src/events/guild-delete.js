const updateBotLists = require("../functions/update-sites.js");
const updatePresence = require("../functions/update-presence.js");
const log = require("../functions/log-to-channel.js");

module.exports = (bot) => {
	bot.on("guildDelete", (server) => {
		updateBotLists(bot);
		updatePresence(bot);
		log(bot, ":outbox_tray: │ Server #" + bot.guilds.size.toLocaleString() + ": `" + server.name + "` (" + server.memberCount.toLocaleString() + " members)");
	});
};