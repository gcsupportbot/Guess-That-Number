const BaseCommand = require('../Structure/BaseCommand');
const handleDatabaseError = require('../Util/handleDatabaseError');

class Leaderboard extends BaseCommand {
	constructor(bot, r) {
		super({
			command: 'leaderboard',
			aliases: [
				'lb',
				'scoreboard',
				'sb'
			],
			description: 'View the global leaderboard.',
			category: 'Game',
			usage: 'leaderboard [easy|medium|hard]',
			hidden: false
		});
		this.bot = bot;
		this.r = r;
	}

	execute(msg, args) {
		const difficulty = args.length > 0 ? (args[0].toLowerCase() === 'easy' ? 1 : args[0].toLowerCase() === 'medium' ? 2 : args[0].toLowerCase() === 'hard' ? 3 : NaN) : 2;
		if (isNaN(difficulty)) return msg.channel.createMessage(':exclamation:   **»**   Unknown argument `' + args[0].toLowerCase() + '`. Please refer to the command usage for more information.');
		this.r.table('leaderboard').filter({ difficulty }).orderBy(this.r.asc('score')).without('id', 'difficulty').run((error, response) => {
			if (error) return handleDatabaseError(error, msg);
			response = response.map((i) => {
				const user = this.bot.users.get(i.userID);
				i.tag = user ? user.username + '#' + user.discriminator : false;
				return i;
			}).filter((v) => v.tag);
			if (response.length < 1) return msg.channel.createMessage(':exclamation:   **»**   No users have played ' + ((difficulty === 1) ? 'easy' : ((difficulty === 2) ? 'medium' : ((difficulty === 3) ? 'hard' : 'unknown'))) + ' difficulty.');
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
						this.bot.leaderboardPages[msg.author.id] = {
							page: 1,
							messageID: msgresponse.id,
							difficulty
						};
					});
				}, 500);
			}).catch(() => { });
		});
	}
}

module.exports = Leaderboard;