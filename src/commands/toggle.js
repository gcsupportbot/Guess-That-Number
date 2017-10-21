const handleDatabaseError = require("../functions/handle-database-error.js");
const config = require("../config.json");

module.exports = {
	commands: [
		"toggle",
		"tog"
	],
	usage: "toggle",
	description: "Send guess as single message.",
	category: "Game",
	hidden: false,
	execute: (bot, r, msg) => {
		r.table("games").get(msg.author.id).run((error, response) => {
			if (error) return handleDatabaseError(error, msg);
			if (response) {
				r.table("toggle").get(msg.author.id).run((error, response) => {
					if (error) return handleDatabaseError(error, msg);
					if (response) {
						r.table("toggle").get(msg.author.id).delete().run((error) => {
							if (error) return handleDatabaseError(error, msg);
							if (msg.author.data) msg.author.data.toggle = false;
							msg.channel.send({
								embed: {
									title: "Toggled!",
									color: 3066993,
									description: "Turned off toggle mode."
								}
							});
						});
					} else {
						r.table("toggle").insert({ id: msg.author.id }).run((error) => {
							if (error) return handleDatabaseError(error, msg);
							if (!msg.author.data) msg.author.data = {};
							msg.author.data.toggle = true;
							msg.channel.send({
								embed: {
									title: "Toggled!",
									color: 3066993,
									description: "All your messages that are numbers will be counted as a guess from now on."
								}
							});
						});
					}
				});
			} else {
				msg.channel.send({
					embed: {
						title: "Error!",
						color: 0xE50000,
						description: "You must be in a game to use this command. Start a game using `" + ((msg.guild) ? msg.guild.data.prefix : config.prefix) + "start`."
					}
				});
			}
		});
	}
};