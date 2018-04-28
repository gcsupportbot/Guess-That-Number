const BaseCommand = require('../Structure/BaseCommand');
const handleDatabaseError = require('../Util/handleDatabaseError');

class Achievements extends BaseCommand {
	constructor(bot, r) {
		super({
			command: 'achievements',
			aliases: [
				'ach'
			],
			description: 'View your achievements and progress.',
			category: 'Game',
			usage: 'achievements',
			hidden: false
		});
		this.bot = bot;
		this.r = r;
	}

	execute(msg) {
		this.r.table('achievements').get(msg.author.id).run((error, achievements) => {
			if (error) return handleDatabaseError(error, msg);
			msg.channel.createMessage({
				embed: {
					title: 'Achievements',
					color: 3066993,
					description: ':tada: │ Complete 50 games    │ ' + (achievements ? (achievements.gamesCompleted < 25 ? ((Math.floor(achievements.gamesCompleted / 50) * 100) + '% completed') : 'Completed') : '0% completed') + '\n'
						+ ':tada: │ Complete 100 games  │ ' + (achievements ? (achievements.gamesCompleted < 25 ? ((Math.floor(achievements.gamesCompleted / 100) * 100) + '% completed') : 'Completed') : '0% completed') + '\n'
						+ ':tada: │ Complete 200 games │ ' + (achievements ? (achievements.gamesCompleted < 25 ? ((Math.floor(achievements.gamesCompleted / 200) * 100) + '% completed') : 'Completed') : '0% completed') + '\n'
						+ ':tada: │ Complete 500 games │ ' + (achievements ? (achievements.gamesCompleted < 25 ? ((Math.floor(achievements.gamesCompleted / 500) * 100) + '% completed') : 'Completed') : '0% completed')
				}
			});
		});
	}
}

module.exports = Achievements;