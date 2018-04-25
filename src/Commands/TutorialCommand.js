const BaseCommand = require('../Structure/BaseCommand');

class Tutorial extends BaseCommand {
	constructor(bot, r) {
		super({
			command: 'tutorial',
			aliases: [
				'howtoplay'
			],
			description: 'Learn how to play this game.',
			category: 'Developers',
			usage: 'exec <command...>',
			hidden: true
		});
		this.bot = bot;
		this.r = r;
	}

	execute(msg) {
		msg.channel.createMessage('```\n--- OVERVIEW ---\n\n' + this.bot.user.username + ' is a simple number-guessing game created for the fun-of-it. This game is entirely based on luck. To get started, type `' + msg.prefix + 'start`. This will start a new game.\n\n--- GUESSING ---\n\nWhen you start a game, it will generate a random number from 1 to 100,000 (default medium difficulty). You will have to guess what the number is. Don\'t worry, you will be given hints every time you guess.\n\n--- DIFFICULTIES ---\n\nA new feature was added called difficulty levels. This feature makes it so that you can choose the maximum that the number can generates. Easy generates a random number from 1 to 10,000. Medium goes to 100,000 and hard goes to 1,000,000. Pass any of these difficulty levels to `start` or `leaderboard` to use them.\n\n--- LEADERBOARD ---\n\nWhen you guess the number correctly, you will be placed on the leaderboard. If you have more guesses than your lowest guess count, it will not affect your leaderboard score. The leaderboard is where everyone ranks at. If the bot no longer sees you in any server, you will not be shown in the leaderboard because it cannot get any data on you. Once you are visible again, you will be shown on the leaderboard.\n\n--- GAME DATA ---\n\nAll your data - current game & leaderboard position - are saved within a database. If the bot restarts for any reason, your data will not be lost. Now you don\'t have to worry!\n\n--- DEVELOPMENT ---\n\nThis bot is still in development and may undergo a restart at any time. If your command for some reason does not send a message back, try again. If the issue persists after 5 times, contact the owner immediently.\n\n--- WRAP UP ---\n\nThis is a really simple game, if you think about it. If you really like this game, feel free to add it to your server or encourage your friends to add it to theirs. Have fun!```');
	}
}

module.exports = Tutorial;