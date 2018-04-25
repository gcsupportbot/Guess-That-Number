const BaseCommand = require('../Structure/BaseCommand');
const handleDatabaseError = require('../Util/handleDatabaseError');

class Toggle extends BaseCommand {
	constructor(bot, r) {
		super({
			command: 'toggle',
			aliases: [
				'tog'
			],
			description: 'Send guess as single message.',
			category: 'Game',
			usage: 'toggle',
			hidden: false
		});
		this.bot = bot;
		this.r = r;
	}

	execute(msg) {
		this.r.table('games').get(msg.author.id).run((error, response) => {
			if (error) return handleDatabaseError(error, msg);
			if (!response) return msg.channel.createMessage(':exclamation:   **»**   You must be in a game to use this command. Start a game using `' + msg.prefix + 'start`.');
			this.r.table('toggle').get(msg.author.id).run((error, response) => {
				if (error) return handleDatabaseError(error, msg);
				if (response) return this.r.table('toggle').get(msg.author.id).delete().run((error) => {
					if (error) return handleDatabaseError(error, msg);
					this.bot.toggle.delete(msg.author.id);
					msg.channel.createMessage(':pause_button:   **»**   Turned off toggle mode.');
				});
				this.r.table('toggle').insert({ id: msg.author.id }).run((error) => {
					if (error) return handleDatabaseError(error, msg);
					this.bot.toggle.set(msg.author.id, true);
					msg.channel.createMessage(':arrow_forward:   **»**   All your messages that are numbers will be counted as a guess from now on.');
				});
			});
		});
	}
}

module.exports = Toggle;