const config = require("../config.json");
const child_process = require("child_process");
const snekfetch = require("snekfetch");
const removeSensitiveInformation = require("../functions/remove-sensitive-information.js");

module.exports = {
	commands: [
		"exec"
	],
	usage: "exec <command>",
	description: "Execute commands in the console.",
	category: "Developers",
	hidden: true,
	execute: (bot, r, msg, args) => {
		if (config.trusted.indexOf(msg.author.id) > -1) {
			if (args.length > 0) {
				child_process.exec(args.join(" "), (error, stdout) => {
					let result = (error || stdout).toString();
					result = removeSensitiveInformation(result);
					if (result.length > 1985) {
						snekfetch.post("https://haste.passthemayo.space/documents").send(result).then((body) => {
							msg.channel.send({
								embed: {
									title: "Warning!",
									color: 0xFFA500,
									description: "Result was over 2,000 characters, Generated hastebin link instead. https://haste.passthemayo.space/" + body.body.key + ".js"
								}
							});
						}).catch((error) => {
							msg.channel.send({
								embed: {
									title: "Error!",
									color: 0xE50000,
									description: "Failed to generate hastebin link. `" + error.message + "`"
								}
							});
						});
					} else {
						msg.channel.send("```\n" + result.replace(/`/g, "'") + "```");
					}
				});
			} else {
				msg.channel.send({
					embed: {
						title: "Error!",
						color: 0xE50000,
						description: "Missing `<command>` option."
					}
				});
			}
		} else {
			msg.channel.send({
				embed: {
					title: "Error!",
					color: 0xE50000,
					description: "You do not have permission to execute this command."
				}
			});
		}
	}
};