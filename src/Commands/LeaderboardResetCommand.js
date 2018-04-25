const humanizeDuration = require('humanize-duration');
const BaseCommand = require('../Structure/BaseCommand');
const handleDatabaseError = require('../Util/handleDatabaseError');

class LeaderboardReset extends BaseCommand {
	constructor(bot, r) {
		super({
			command: 'leaderboardreset',
			aliases: [
				'lbreset',
				'scoreboardreset',
				'sbreset'
			],
			description: 'Check how long until the leaderboard resets.',
			category: 'Game',
			usage: 'leaderboardreset',
			hidden: false
		});
		this.bot = bot;
		this.r = r;
	}

	execute(msg) {
		this.r.table('intervals').get('reset').run((error, response) => {
			if (error) return handleDatabaseError(error, msg);
			msg.channel.createMessage(':repeat:   **»**   The leaderboard will reset in `' + humanizeDuration((1000 * 60 * 60 * 24 * 15) - (Date.now() - response.timestamp), {
				round: true
			}) + '`.');
		});
	}
}

module.exports = LeaderboardReset;