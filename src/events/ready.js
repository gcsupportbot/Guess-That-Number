const log = require('../util/logger.js');
const handleDatabaseError = require('../util/handleDatabaseError.js');
const config = require('../config.json');
const dashboard = require('../website/index.js');
const updatePresence = require('../util/updatePresence.js');

module.exports = (bot, r) => {
	bot.on('ready', () => {
		log.info(bot.user.username + ' is ready!');
		bot.startTime = Date.now();
		dashboard(bot, r);
		updatePresence(bot);
		bot.guilds.map((g) => {
			bot.prefixes.set(g.id, config.prefix);
		});
		r.table('prefixes').run((error, response) => {
			if (error) return handleDatabaseError(error);
			response.map((v) => {
				bot.prefixes.set(v.id, v.prefix);
			});
		});
		r.table('toggle').run((error, response) => {
			if (error) return handleDatabaseError(error);
			response.map((u) => {
				bot.toggle.set(u.id, true);
			});
		});

		process.on('unhandledRejection', (error) => {
			if (error.code === 50013 || error.code === 50001 || error.code === 50007) return;
			console.error(error);
		});
		process.on('uncaughtException', console.error);
		process.on('SIGINT', () => {
			bot.editStatus('invisible');
			bot.disconnect({
				reconnect: false
			});
			process.exit();
		});
	});
};
