const snekfetch = require("snekfetch");
const config = require("../config.json");

module.exports = (bot) => {
	snekfetch.post("https://www.carbonitex.net/discord/data/botdata.php").send({
		key: config.api_keys.bot_list.carbonitex,
		servercount: bot.guilds.size
	}).catch(() => {});
	snekfetch.post("https://discordbots.org/api/bots/" + bot.user.id + "/stats").set("Authorization", config.api_keys.bot_list["discordbots.org"]).send({
		server_count: bot.guilds.size
	}).catch(() => {});
	snekfetch.post("https://bots.discord.pw/api/bots/" + bot.user.id + "/stats").set("Authorization", config.api_keys.bot_list["bots.discord.pw"]).send({
		server_count: bot.guilds.size
	}).catch(() => {});
};