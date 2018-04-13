const logger = require('../util/logger.js');
const handleDatabaseError = require('../util/handleDatabaseError.js');
const config = require('../config.json');
const dashboard = require('../website/index.js');
const updatePresence = require('../util/updatePresence.js');
const handleRaffle = require('../util/handleRaffle.js');
const GuildSettings = require('../structure/GuildSettings.js');

module.exports = (bot, r) => {
	bot.on('ready', () => {
		logger.info(bot.user.username + ' is ready!');
		bot.startTime = Date.now();
		dashboard(bot, r);
		updatePresence(bot);
		bot.guilds.map((g) => {
			bot.prefixes.set(g.id, config.prefix);
		});
		r.table('prefixes').run((error, response) => {
			if (error) return handleDatabaseError(error);
			for (let i = 0; i < response.length; i++) {
				bot.prefixes.set(response[i].id, response[i].prefix);
			}
		});
		r.table('settings').run((error, response) => {
			if (error) return handleDatabaseError(error);
			for (let i = 0; i < response.length; i++) {
				bot.settings.set(response[i].id, new GuildSettings(response[i]));
			}
		});
		r.table('toggle').run((error, response) => {
			if (error) return handleDatabaseError(error);
			response.map((u) => {
				bot.toggle.set(u.id, true);
			});
		});
		handleRaffle(bot, r);

		process.on('unhandledRejection', (error) => {
			if (error.code === 50013 || error.code === 50001 || error.code === 50007) return;
			logger.error(error);
		});
		process.on('uncaughtException', logger.error);
		process.on('SIGINT', () => {
			bot.editStatus('invisible');
			bot.disconnect({
				reconnect: false
			});
			process.exit();
		});
	});
};
