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
		r.table("games").filter({userID: msg.author.id}).run((error, response) => {
			if (error) return handleDatabaseError(error, msg);
			if (response.length > 0) {
				r.table("games").filter({userID: msg.author.id}).delete().run((error) => {
					if (error) return handleDatabaseError(error, msg);
					if (msg.author.data && msg.author.data.toggle) {
						r.table("toggle").filter({userID: msg.author.id}).delete().run((error) => {
							if (error) return handleDatabaseError(error, msg);
							msg.author.data.toggle = false;
							msg.channel.send({
								embed: {
									title: "You force ended the game!",
									color: 3066993,
									description: "The correct number is `" + response[0].number + "`.\n\nYou guessed `" + response[0].score + "` times before ending the game.\n\nThe game was active for `" + humanizeduration(Date.now() - response[0].start_time, {
										round: true
									}) + "`.",
									footer: {
										text: "Requested by " + msg.author.tag
									}
								}
							});
						});
					} else {
						msg.channel.send({
							embed: {
								title: "You force ended the game!",
								color: 3066993,
								description: "The correct number is `" + response[0].number + "`.\n\nYou guessed `" + response[0].score + "` times before ending the game.\n\nThe game was active for `" + humanizeduration(Date.now() - response[0].start_time, {
									round: true
								}) + "`.",
								footer: {
									text: "Requested by " + msg.author.tag
								}
							}
						});
					}
				});
			} else {
				msg.channel.send({
					embed: {
						title: "Error!",
						color: 0xE50000,
						description: "You're not in a game. To start one, use `" + ((msg.guild) ? msg.guild.data.prefix : config.prefix) + "start`.",
						footer: {
							text: "Requested by " + msg.author.tag
						}
					}
				});
			}
		});
	}
};