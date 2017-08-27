const Discord = require("discord.js");
const dateformat = require("dateformat");
const config = require(__dirname + "/config.json");
const log = require("./managers/logger.js");

const shard = new Discord.ShardingManager(__dirname + "/index.js", {
    totalShards: "auto",
    token: config.token,
    respawn: true
});

shard.on("launch", s => {
    log("Launching shard " + (s.id + 1) + "/" + shard.totalShards);
});

shard.spawn();