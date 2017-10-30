const Eris = require("eris");
const fs = require("fs");
const rethink = require("rethinkdbdash");
const config = require("./config.json");
const log = require("./managers/logger.js");

const bot = new Eris(config.token, {
	disableEvents: {
		"TYPING_START": true,
		"USER_UPDATE": true,
		"VOICE_STATE_UPDATE": true,
		"PRESENCE_UPDATE": true
	},
	disableEveryone: true,
	maxShards: "auto"
});

bot.commands = [];
bot.prefixes = {};

const r = rethink(config.rethink);

let start = Date.now();

fs.readdir("./commands/", (error, files) => {
	if (error) throw new error();
	files.map((file) => {
		bot.commands[file.replace(/\..*/, "")] = require("./commands/" + file);
		if (files.indexOf(file) === files.length - 1) {
			log("Loaded " + files.length + " commands! (" + (Date.now() - start) + " ms)");
			fs.readdir("./events", (error, files) => {
				if (error) throw new error();
				files.map((file) => {
					require("./events/" + file)(bot, r);
					if (files.indexOf(file) === files.length - 1) {
						log("Loaded " + files.length + " events! (" + (Date.now() - start) + " ms)");
						start = Date.now();
						fs.readdir("./schedulers", (error, files) => {
							if (error) throw new error();
							files.map((index) => {
								setInterval(require("./schedulers/" + index).execute, require("./schedulers/" + index).interval, bot, r);
								if (files.indexOf(index) === files.length - 1) {
									log("Loaded " + files.length + " schedules! (" + (Date.now() - start) + " ms)");
									bot.connect();
								}
							});
						});
					}
				});
			});
		}
	});
});