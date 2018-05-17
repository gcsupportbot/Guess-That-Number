const Eris = require('eris');
const fs = require('fs');
const path = require('path');
const rethink = require('rethinkdbdash');
const Collection = require('./Structure/Collection');
const Logger = require('./Util/Logger');
const config = require('./config.json');

class Client {
	constructor(token, options) {
		this.bot = new Eris(token, options);
	}

	launch() {
		this.r = rethink(config.rethinkdb);

		this.bot.embedColor = 15277667;
		this.bot.commands = new Collection();
		this.bot.prefixes = new Collection();
		this.bot.toggle = new Collection();
		this.bot.leaderboardPages = {};

		this.loadCommand(path.join(__dirname, 'Commands'));
		this.loadEvents(path.join(__dirname, 'Events'));

		process.on('exit', () => {
			this.bot.disconnect({
				reconnect: false
			});
		});

		process.on('unhandledRejection', (error) => {
			if (error.code && (error.code === 50013 || error.code === 50007)) return;
			Logger.error(error);
		});

		this.bot.connect();
	}

	loadCommand(dir) {
		fs.readdir(dir, (error, commands) => {
			if (error) throw error;
			for (let i = 0; i < commands.length; i++) {
				const Command = require(path.join(__dirname, 'Commands', commands[i]));
				const command = new Command(this.bot, this.r);
				command.file = path.join(__dirname, 'Commands', commands[i]);
				this.bot.commands.set(command.command, command);
			}
		});
	}

	loadEvents(dir) {
		fs.readdir(dir, (error, events) => {
			if (error) throw error;
			for (let i = 0; i < events.length; i++) {
				const event = require(path.join(__dirname, 'Events', events[i]));
				event(this.bot, this.r);
			}
		});
	}
}

module.exports = Client;