const BaseCommand = require('../Structure/BaseCommand');
const handleDatabaseError = require('../Util/handleDatabaseError');

class Restart extends BaseCommand {
	constructor(bot, r) {
		super({
			command: 'restart',
			aliases: [
				'res'
			],
			description: 'Restarts the bot.',
			category: 'Developers',
			usage: 'restart',
			hidden: true
		});
		this.bot = bot;
		this.r = r;
	}

	execute(msg) {
		this.r.table('developers').get(msg.author.id).run(async (error, developer) => {
			if (error) return handleDatabaseError(error, msg);
			if (!developer) return msg.channel.createMessage(':no_entry_sign:   **»**   You do not have permission to run this command.');
			msg.channel.createMessage(':arrows_counterclockwise:   **»**   Automatically restarting the bot.').then(process.exit);
		});
	}
}

module.exports = Restart;