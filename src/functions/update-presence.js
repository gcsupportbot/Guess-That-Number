const config = require("../config.json");

module.exports = (bot) => {
	bot.setStatus("online", {
		name: bot.guilds.size + " Servers | " + config.prefix + "help",
		type: 0
	});
};