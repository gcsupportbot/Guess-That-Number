const config = require("../config.json");
const handleDatabaseError = require("./handle-database-error.js");
const guess = require("../commands/guess.js");

module.exports = (bot, r, msg) => {
	if (!msg.author || msg.author.bot) return;
	if (bot.toggle.indexOf(msg.author.id) > -1) {
		if (msg.content !== "" && !isNaN(parseInt(msg.content))) {
			let new_event = Object.create(msg);
			new_event.content = config.prefix + "guess " + Number(msg.content);
			guess.execute(bot, r, new_event, new_event.content.split(" ").slice(1));
			return;
		}
	}
	if (msg.channel.guild) bot.prefixes[msg.channel.guild.id] = bot.prefixes[msg.channel.guild.id] || config.prefix;
	let prefix = ((msg.content.startsWith(((msg.channel.guild) ? bot.prefixes[msg.channel.guild.id] : config.prefix))) ? ((msg.channel.guild) ? bot.prefixes[msg.channel.guild.id] : config.prefix) : ((msg.content.startsWith("<@" + bot.user.id + ">")) ? "<@" + bot.user.id + "> " : ((msg.content.startsWith("<@!" + bot.user.id + ">")) ? "<@!" + bot.user.id + "> " : null)));
	if (!prefix) return;
	let command = Object.keys(bot.commands).filter((c) => bot.commands[c].commands.indexOf(msg.content.replace(prefix, "").split(" ")[0]) > -1);
	if (command.length > 0) {
		const args = ((msg.content.replace(prefix, "").split(" ").length > 1) ? msg.content.replace(prefix, "").split(" ").slice(1) : []);
		try {
			bot.commands[command[0]].execute(bot, r, msg, args);
		} catch (error) {
			msg.channel.createMessage({
				embed: {
					title: "Error!",
					color: 0xE50000,
					description: "An error occured when attempting to execute command."
				}
			});
			console.error("Failed to execute '" + bot.commands[command[0]].commands[0] + "' command.", error);
		}
		r.table("command_stats").insert({
			userID: msg.author.id,
			channelID: (msg.channel.guild) ? msg.channel.id : null,
			serverID: (msg.channel.guild) ? msg.channel.guild.id : null,
			command: bot.commands[command[0]].commands[0],
			args: (args.length > 0) ? args : null,
			timestamp: Date.now()
		}).run((error) => {
			if (error) handleDatabaseError(error);
		});
	}
};