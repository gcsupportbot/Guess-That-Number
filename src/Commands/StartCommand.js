const BaseCommand = require('../Structure/BaseCommand');
const handleDatabaseError = require('../Util/handleDatabaseError');

class Start extends BaseCommand {
	constructor(bot, r) {
		super({
			command: 'start',
			aliases: [
				's'
			],
			description: 'Starts a new game.',
			category: 'Game',
			usage: 'start [easy|medium|hard|extreme]',
			hidden: false
		});
		this.bot = bot;
		this.r = r;
	}

	execute(msg, args) {
		this.r.table('games').get(msg.author.id).run((error, response) => {
			if (error) return handleDatabaseError(error, msg);
			if (response) return msg.channel.createMessage(':exclamation:   **»**   You already have a game in-progress.');
			const difficulty = args.length > 0 ? (args[0].toLowerCase() === 'easy' ? 1 : args[0].toLowerCase() === 'medium' ? 2 : args[0].toLowerCase() === 'hard' ? 3 : args[0].toLowerCase() === 'extreme' ? 4 : 'unknown') : 2;
			if (difficulty === 'unknown') msg.channel.createMessage(':exclamation:   **»**   Unknown argument `' + args[0].toLowerCase() + '`. Please refer to the command usage for more information.');
			const max = difficulty === 1 ? 10000 : difficulty === 2 ? 100000 : difficulty === 3 ? 1000000 : difficulty === 4 ? 1000000000 : 100000;
			this.r.table('games').insert({
				id: msg.author.id,
				score: 0,
				number: Math.floor(Math.random() * max),
				start_time: Date.now(),
				difficulty
			}).run((error) => {
				if (error) return handleDatabaseError(error, msg);
				msg.channel.createMessage({
					embed: {
						title: 'You started a new game!',
						color: 3066993,
						description: 'Use `' + msg.prefix + 'guess <number>` to guess a number.\n\nThe numbers range from `1 to ' + String(max).replace(/(.)(?=(\d{3})+$)/g, '$1,') + '`.\n\nYou will be given a hint every time you guess, that will say either \'higher\' or \'lower\'.\n\nGood luck!',
						footer: {
							text: 'Requested by ' + msg.author.username + '#' + msg.author.discriminator
						}
					}
				});
			});
		});
	}
}

module.exports = Start;