const config = require("../config.json");

module.exports = (bot) => {
	bot.user.setPresence({
		game: {
			name: bot.guilds.size + " Servers | " + config.prefix + "help",
			type: 0
		}
	});
};