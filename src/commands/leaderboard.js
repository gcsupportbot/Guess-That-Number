const handleDatabaseError = require('../util/handleDatabaseError.js');

module.exports = {
	commands: [
		'leaderboard',
		'scoreboard',
		'lb',
		'sb'
	],
	usage: 'leaderboard ["easy" | "medium" | "hard"]',
	description: 'View the server leaderboard.',
	category: 'Game',
	hidden: false,
	execute: (bot, r, msg, args) => {
		let difficulty = NaN;
		if (args.length > 0) {
			if (args[0] === 'easy') {
				difficulty = 1;
			} else if (args[0] === 'medium') {
				difficulty = 2;
			} else if (args[0] === 'hard') {
				difficulty = 3;
			}
		} else {
			difficulty = 2;
		}
		if (!isNaN(difficulty)) {
			r.table('leaderboard').filter({ difficulty }).orderBy(r.asc('score')).without('id', 'difficulty').run((error, response) => {
				if (error) return handleDatabaseError(error, msg);
				response = response.map((i) => {
					i.tag = bot.users.get(i.userID) && bot.users.get(i.userID).username + '#' + bot.users.get(i.userID).discriminator;
					return i;
				}).filter((v) => v.tag);
				if (response.length > 0) {
					msg.channel.createMessage({
						embed: {
							title: 'Global Leaderboard',
							description: response.length + ' users have played ' + ((difficulty === 1) ? 'easy' : ((difficulty === 2) ? 'medium' : ((difficulty === 3) ? 'hard' : 'unknown'))) + ' difficulty.',
							color: 3066993,
							fields: response.slice(0, 10).map((v) => {
								return {
									name: (response.indexOf(v) + 1) + '. ' + v.tag,
									value: 'Score: ' + v.score,
									inline: false
								};
							}),
							footer: {
								text: 'Page 1 / ' + Math.ceil(response.length / 10)
							}
						}
					}).then((msgresponse) => {
						if (response.length < 11) return;
						setTimeout(() => {
							msgresponse.addReaction('⬅').then(() => {
								setTimeout(() => {
									msgresponse.addReaction('➡');
								}, 500);
								bot.leaderboardPages[msg.author.id] = {
									page: 1,
									messageID: msgresponse.id,
									difficulty
								};
							});
						}, 500);
					}).catch(() => { });
				} else {
					msg.channel.createMessage({
						embed: {
							title: 'Global Leaderboard',
							color: 3066993,
							description: 'No users have played ' + ((difficulty === 1) ? 'easy' : ((difficulty === 2) ? 'medium' : ((difficulty === 3) ? 'hard' : 'unknown'))) + ' difficulty.'
						}
					});
				}
			});
		} else {
			msg.channel.createMessage({
				embed: {
					title: 'Error!',
					color: 0xE50000,
					description: 'Unknown option, `' + args[0] + '`. Please use `easy`, `medium`, or `hard`.'
				}
			});
		}
	}
};