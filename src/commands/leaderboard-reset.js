const handleDatabaseError = require('../util/handleDatabaseError.js');
const humanizeduration = require('humanize-duration');

module.exports = {
	commands: [
		'leaderboardreset',
		'scoreboardreset',
		'lbreset',
		'sbreset'
	],
	usage: 'leaderboardreset',
	description: 'Check how long until the leaderboard resets.',
	category: 'General',
	hidden: false,
	execute: (bot, r, msg) => {
		r.table('intervals').get('reset').run((error, response) => {
			if (error) return handleDatabaseError(error, msg);
			msg.channel.createMessage({
				embed: {
					title: 'Leaderboard Reset',
					color: 3066993,
					description: 'The leaderboard will reset in `' + humanizeduration((1000 * 60 * 60 * 24 * 15) - (Date.now() - response.timestamp), {
						round: true
					}) + '`.'
				}
			});
		});
	}
};