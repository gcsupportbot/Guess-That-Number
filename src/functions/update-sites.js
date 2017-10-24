const snekfetch = require("snekfetch");
const config = require("../config.json");

module.exports = (bot) => {
	bot.shard.fetchClientValues("guilds.size").then((server_count) => {
		snekfetch.post("https://www.carbonitex.net/discord/data/botdata.php").send({
			key: config.api_keys.bot_list.carbonitex,
			servercount: server_count.reduce((a, b) => a + b, 0)
		}).catch(() => {});
		snekfetch.post("https://discordbots.org/api/bots/" + bot.user.id + "/stats").set("Authorization", config.api_keys.bot_list["discordbots.org"]).send({
			server_count: server_count.reduce((a, b) => a + b, 0)
		}).catch(() => {});
		snekfetch.post("https://bots.discord.pw/api/bots/" + bot.user.id + "/stats").set("Authorization", config.api_keys.bot_list["bots.discord.pw"]).send({
			server_count: server_count.reduce((a, b) => a + b, 0)
		}).catch(() => {});
	}).catch(console.error);
};