const config = require("../config.json");

module.exports = (bot) => {
	bot.editStatus("online", {
		name: config.links.server + " | " + config.prefix + "help",
		type: 0
	});
};