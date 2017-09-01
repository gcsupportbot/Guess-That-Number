const snekfetch = require("snekfetch");
const config = require("../config.json");
const util = require("util");

module.exports = (bot) => {
    snekfetch.post("https://discordbots.org/api/bots/" + bot.user.id + "/stats").set("Authorization", config.api_keys.bot_list["discordbots.org"]).send({
        server_count: bot.guilds.size,
        shard_id: bot.shard.id,
        shard_count: bot.shard.count
    }).catch(() => {});
    snekfetch.post("https://bots.discord.pw/api/bots/" + bot.user.id + "/stats").set("Authorization", config.api_keys.bot_list["bots.discord.pw"]).send({
        server_count: bot.guilds.size,
        shard_id: bot.shard.id,
        shard_count: bot.shard.count
    }).catch(() => {});
    bot.shard.fetchClientValues("guilds.size").then((guilds) => {
        snekfetch.post("https://www.carbonitex.net/discord/data/botdata.php").send({
            key: config.api_keys.bot_list.carbonitex,
            servercount: guilds.reduce((a, b) => a + b, 0)
        }).catch(() => {});
    }).catch(console.error);
};