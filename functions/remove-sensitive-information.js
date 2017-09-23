const config = require("../config.json");

module.exports = (data) => {
	return data
		.split(config.token).join("-- BOT TOKEN --")
		.split(config.api_keys.bot_list["discordbots.org"]).join("-- discordbots.org API KEY --")
		.split(config.api_keys.bot_list["bots.discord.pw"]).join("-- bots.discord.pw API KEY --")
		.split(config.rethink.host).join("-- RETHINKDB HOST IP ADDRESS --")
		.split(config.api_keys.datadog.api_key).join("-- DATADOG API KEY --")
		.split(config.api_keys.datadog.app_key).join("-- DATADOG APP KEY --")
		.split(config.api_keys.bot_list.carbonitex).join("-- CARBONITEX API KEY --");
};