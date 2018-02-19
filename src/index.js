const Eris = require('eris');
const fs = require('fs');
const rethink = require('rethinkdbdash');
const path = require('path');
const config = require('./config.json');
const log = require('./util/logger.js');

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

bot.commands = [];
bot.prefixes = {};
bot.toggle = [];
bot.leaderboardPages = {};

const r = rethink(config.rethink);

let start = Date.now();

fs.readdir(path.join(__dirname, 'commands'), (error, files) => {
	if (error) throw error;
	files.map((file) => {
		bot.commands[file.replace(/\..*/, '')] = require(path.join(__dirname, 'commands', file));
		if (files.indexOf(file) === files.length - 1) {
			log('Loaded ' + files.length + ' commands! (' + (Date.now() - start) + ' ms)');
			fs.readdir(path.join(__dirname, 'events'), (error, files) => {
				if (error) throw error;
				files.map((file) => {
					require(path.join(__dirname, 'events', file))(bot, r);
					if (files.indexOf(file) === files.length - 1) {
						log('Loaded ' + files.length + ' events! (' + (Date.now() - start) + ' ms)');
						start = Date.now();
						fs.readdir(path.join(__dirname, 'schedulers'), (error, files) => {
							if (error) throw error;
							files.map((index) => {
								const schedule = require(path.join(__dirname, 'schedulers', index));
								setInterval(schedule.execute, schedule.interval, bot, r);
								if (files.indexOf(index) === files.length - 1) {
									log('Loaded ' + files.length + ' schedules! (' + (Date.now() - start) + ' ms)');
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