const handleDatabaseError = require("../functions/handle-database-error.js");
const config = require("../config.json");
const humanizeduration = require("humanize-duration");

module.exports = {
	commands: [
		"end",
		"stop",
		"quit",
		"e"
	],
	usage: "end",
	description: "End your current game.",
	category: "Game",
	hidden: false,
	execute: (bot, r, msg) => {
		r.table("games").get(msg.author.id).run((error, response) => {
			if (error) return handleDatabaseError(error, msg);
			if (response) {
				r.table("games").get(msg.author.id).delete().run((error) => {
					if (error) return handleDatabaseError(error, msg);
					if (msg.author.data && msg.author.data.toggle) {
						r.table("toggle").get(msg.author.id).delete().run((error) => {
							if (error) return handleDatabaseError(error, msg);
							msg.author.data.toggle = false;
							msg.channel.createMessage({
								embed: {
									title: "You force ended the game!",
									color: 3066993,
									description: "The correct number is `" + response.number + "`.\n\nYou guessed `" + response.score + "` times before ending the game.\n\nThe game was active for `" + humanizeduration(Date.now() - response.start_time, {
										round: true
									}) + "`.",
									footer: {
										text: "Requested by " + msg.author.username + "#" + msg.author.discriminator
									}
								}
							});
						});
					} else {
						msg.channel.createMessage({
							embed: {
								title: "You force ended the game!",
								color: 3066993,
								description: "The correct number is `" + response.number + "`.\n\nYou guessed `" + response.score + "` times before ending the game.\n\nThe game was active for `" + humanizeduration(Date.now() - response.start_time, {
									round: true
								}) + "`.",
								footer: {
									text: "Requested by " + msg.author.username + "#" + msg.author.discriminator
								}
							}
						});
					}
				});
			} else {
				msg.channel.createMessage({
					embed: {
						title: "Error!",
						color: 0xE50000,
						description: "You're not in a game. To start one, use `" + ((msg.channel.guild) ? bot.prefixes[msg.channel.guild.id] : config.prefix) + "start`.",
						footer: {
							text: "Requested by " + msg.author.username + "#" + msg.author.discriminator
						}
					}
				});
			}
		});
	}
};