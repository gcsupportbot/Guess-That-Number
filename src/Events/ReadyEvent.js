const Logger = require('../Util/Logger.js');
const handleAutoKick = require('../Util/handleAutoKick');
const handleLeaderboardReset = require('../Util/handleLeaderboardReset');
const updateGuildCount = require('../Util/updateGuildCount');

module.exports = (bot, r) => {
	bot.on('ready', () => {
		Logger.info('Successfully logged in as ' + bot.user.username + '.');

		handleAutoKick(bot, r);
		handleLeaderboardReset(bot, r);
		updateGuildCount(bot);
	});
};