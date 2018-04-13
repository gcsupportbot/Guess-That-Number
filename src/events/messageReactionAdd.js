const handleDatabaseError = require('../util/handleDatabaseError.js');

module.exports = (bot, r) => {
	bot.on('messageReactionAdd', (message, emoji, userID) => {
		if (!message.author) return;
		if (emoji.name === '❌') {
			if (message.author.id === bot.user.id) {
				r.table('developers').get(userID).run((error, developer) => {
					if (error) return handleDatabaseError(error, message);
					if (!developer) return;
					message.delete();
				});
			}
		} else {
			if (bot.leaderboardPages[userID]) {
				if (emoji.name === '⬅' && bot.leaderboardPages[userID].page === 1) return;
				if (emoji.name === '➡') bot.leaderboardPages[userID].page++;
				if (emoji.name === '⬅') bot.leaderboardPages[userID].page--;
				if (emoji.name !== '⬅' && emoji.name !== '➡') return;
				try {
					r.table('leaderboard').filter({ difficulty: bot.leaderboardPages[userID].difficulty }).orderBy(r.asc('score')).run((error, response) => {
						if (error) return handleDatabaseError(error, message);
						response = response.map((i) => {
							i.tag = bot.users.get(i.userID) && bot.users.get(i.userID).username + '#' + bot.users.get(i.userID).discriminator;
							return i;
						}).filter((v) => v.tag);
						message.edit({
							embed: {
								title: 'Global Leaderboard',
								description: response.length + ' users have played ' + ((bot.leaderboardPages[userID].difficulty === 1) ? 'easy' : ((bot.leaderboardPages[userID].difficulty === 2) ? 'medium' : ((bot.leaderboardPages[userID].difficulty === 3) ? 'hard' : 'unknown'))) + ' difficulty.',
								color: 3066993,
								fields: response.slice((bot.leaderboardPages[userID].page * 10) - 10, bot.leaderboardPages[userID].page * 10).map((v) => {
									return {
										name: (response.indexOf(v) + 1) + '. ' + v.tag,
										value: 'Score: ' + v.score,
										inline: false
									};
								}),
								footer: {
									text: 'Page ' + bot.leaderboardPages[userID].page + ' / ' + Math.ceil(response.length / 10)
								}
							}
						});
					});
				} catch (e) {
					message.channel.createMessage(':exclamation: │ Failed to switch pages on global leaderboard.');
					console.error('Failed to switch pages on global leaderboard.', e);
				}
			}
		}
	});
};