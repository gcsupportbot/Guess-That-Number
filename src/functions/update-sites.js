const snekfetch = require("snekfetch");
const config = require("../config.json");

module.exports = (bot) => {
	snekfetch.post("https://www.carbonitex.net/discord/data/botdata.php").send({
		key: config.api_keys.bot_list.carbonitex,
		servercount: bot.guilds.size
	}).catch((error) => {
		console.error("Failed to post server count to Carbonitex.", error.message);
	});
	snekfetch.post("https://discordbots.org/api/bots/" + bot.user.id + "/stats").set("Authorization", config.api_keys.bot_list["discordbots.org"]).send({
		server_count: bot.guilds.size
	}).catch((error) => {
		console.error("Failed to post server count to Discord Bot List.", error.message);
	});
	snekfetch.post("https://ls.terminal.ink/api/bots/" + bot.user.id + "/").set("Authorization", config.api_keys.bot_list["ls.terminal.ink"]).send({
		server_count: bot.guilds.size
	}).catch((error) => {
		console.error("Failed to post server count to Discord Bot List.", error.message);
	});
};