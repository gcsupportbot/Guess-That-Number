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
			commands.map((command) => {
				const cmd = require(path.join(__dirname, 'commands', command));
				bot.commands.set(cmd.command, new Command(cmd));
				if (commands.indexOf(command) === commands.length - 1) {
					log.info('Loaded ' + commands.length + ' commands!');
					events.map((event) => {
						require(path.join(__dirname, 'events', event))(bot, r);
						if (events.indexOf(event) === events.length - 1) {
							log.info('Loaded ' + events.length + ' events!');
							schedulers.map((schedule) => {
								const sch = require(path.join(__dirname, 'schedulers', schedule));
								setInterval(sch.execute, sch.interval, bot, r);
								if (schedulers.indexOf(schedule) === schedulers.length - 1) {
									log.info('Loaded ' + schedulers.length + ' schedules!');
									bot.connect();
								}
							});
						}
					});
				}
			});
		});
	});
});