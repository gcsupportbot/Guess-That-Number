const snekfetch = require("snekfetch");
const config = require("../config.json");
const util = require("util");

module.exports = (bot) => {
    bot.shard.fetchClientValues("guilds.size").then((server_count) => {
        snekfetch.post("https://www.carbonitex.net/discord/data/botdata.php").send({
            key: config.api_keys.bot_list.carbonitex,
            servercount: server_count.reduce((a, b) => a + b, 0)
        }).catch(() => {});
        snekfetch.post("https://list.passthemayo.space/api/bots/" + bot.user.id + "/").set("Authorization", config.api_keys.bot_list["list.passthemayo.space"]).send({
            server_count: server_count.reduce((a, b) => a + b, 0)
        }).catch(() => {});
        snekfetch.post("https://bots.iderp.space/api/bots/" + bot.user.id + "/").set("Authorization", config.api_keys.bot_list["bots.iderp.space"]).send({
            server_count: server_count.reduce((a, b) => a + b, 0)
        }).catch(() => {});
        snekfetch.post("https://discordbots.org/api/bots/" + bot.user.id + "/stats").set("Authorization", config.api_keys.bot_list["discordbots.org"]).send({
            server_count: server_count.reduce((a, b) => a + b, 0)
        }).catch(() => {});
        snekfetch.post("https://bots.discord.pw/api/bots/" + bot.user.id + "/stats").set("Authorization", config.api_keys.bot_list["bots.discord.pw"]).send({
            server_count: server_count.reduce((a, b) => a + b, 0)
        }).catch(() => {});
    }).catch(console.error);
};