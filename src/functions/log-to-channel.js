const config = require("../config.json");

module.exports = (bot, message) => {
	bot.guilds.get(config.official_guild).channels.get(config.log_channel).send(message);
};