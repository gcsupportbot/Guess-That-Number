const Eris = require('eris');
const fs = require('fs');
const rethink = require('rethinkdbdash');
const path = require('path');
const config = require('./config.json');
const log = require('./util/logger.js');
const Collection = require('./structure/Collection.js');
const Command = require('./structure/Command.js');

const bot = new Eris(config.token, {
	disableEvents: {
		'TYPING_START': true,
		'USER_UPDATE': true,
		'VOICE_STATE_UPDATE': true,
		'PRESENCE_UPDATE': true
	},
	disableEveryone: true,
	maxShards: 'auto'
});

bot.commands = new Collection();
bot.prefixes = new Collection();
bot.toggle = new Collection();
bot.leaderboardPages = {};

const r = rethink(config.rethink);

fs.readdir(path.join(__dirname, 'commands'), (error, commands) => {
	if (error) throw error;
	fs.readdir(path.join(__dirname, 'events'), (error, events) => {
		if (error) throw error;
		fs.readdir(path.join(__dirname, 'schedulers'), (error, schedulers) => {
			if (error) throw error;
			for (let i = 0; i < commands.length; i++) {
				const cmd = require(path.join(__dirname, 'commands', commands[i]));
				bot.commands.set(cmd.command, new Command(cmd));
				if (i === commands.length - 1) {
					log.info('Loaded ' + commands.length + ' commands!');
					for (let i = 0; i < events.length; i++) {
						require(path.join(__dirname, 'events', events[i]))(bot, r);
						if (i === events.length - 1) {
							log.info('Loaded ' + events.length + ' events!');
							for (let i = 0; i < schedulers.length; i++) {
								const sch = require(path.join(__dirname, 'schedulers', schedulers[i]));
								setInterval(sch.execute, sch.interval, bot, r);
								if (i === schedulers.length - 1) {
									log.info('Loaded ' + schedulers.length + ' schedules!');
									bot.connect();
								}
							}
						}
					}
				}
			}
		});
	});
});