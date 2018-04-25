const Logger = require('../Util/Logger.js');
const updateGuildCount = require('../Util/updateGuildCount');
const handleDatabaseError = require('../Util/handleDatabaseError');
const handleRaffle = require('../util/handleRaffle');
const handleAutoKick = require('../util/handleAutoKick');
const handleLeaderboardReset = require('../util/handleLeaderboardReset');

module.exports = (bot, r) => {
	bot.on('ready', () => {
		Logger.info('Successfully logged in as ' + bot.user.username + '.');

		r.table('toggle').run((error, response) => {
			if (error) return handleDatabaseError(error);
			response.map((u) => {
				bot.toggle.set(u.id, true);
			});
		});
		handleRaffle(bot, r);
		handleAutoKick(bot, r);
		handleLeaderboardReset(bot, r);
		
		updateGuildCount(bot);
	});
};