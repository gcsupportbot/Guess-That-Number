const updateBotLists = require("../functions/update-sites.js");
const updatePresence = require("../functions/update-presence.js");

module.exports = (bot) => {
	bot.on("guildDelete", () => {
		updateBotLists(bot);
		updatePresence(bot);
	});
};