const Eris = require('eris');
const fs = require('fs');
const rethink = require('rethinkdbdash');
const path = require('path');
const config = require('./config.json');
const logger = require('./util/logger.js');
const Collection = require('./structure/Collection.js');
const Module = require('./structure/Module.js');

const bot = new Eris(config.token, {
	disableEvents: config.disabled_events,
	disableEveryone: true,
	maxShards: 'auto',
	restMode: true
});

bot.modules = new Collection();
bot.prefixes = new Collection();
bot.settings = new Collection();
bot.toggle = new Collection();
bot.startupTime = Date.now();
bot.leaderboardPages = {};

const r = rethink(config.rethink);

fs.readdir(path.join(__dirname, 'modules'), (error, modules) => {
	if (error) throw error;
	fs.readdir(path.join(__dirname, 'events'), (error, events) => {
		if (error) throw error;
		fs.readdir(path.join(__dirname, 'schedulers'), (error, schedulers) => {
			if (error) throw error;
			for (let i = 0; i < modules.length; i++) {
				const mod = require(path.join(__dirname, 'modules', modules[i]));
				bot.modules.set(mod.name, new Module(mod, modules[i]));
				if (i === modules.length - 1) {
					logger.info('Loaded ' + modules.length + ' modules & ' + bot.modules.map((m) => m.commandCount).reduce((a, b) => a + b, 0) + ' commands!');
					for (let i = 0; i < events.length; i++) {
						require('./events/' + events[i])(bot, r);
						if (i === events.length - 1) {
							logger.info('Loaded ' + events.length + ' events!');
							for (let i = 0; i < schedulers.length; i++) {
								const schedule = require('./schedulers/' + schedulers[i]);
								setInterval(schedule.execute, schedule.interval, bot, r);
								if (i === schedulers.length - 1) {
									logger.info('Loaded ' + schedulers.length + ' schedulers!');
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