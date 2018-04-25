const util = require('util');
const BaseCommand = require('../Structure/BaseCommand');
const uploadToHastebin = require('../Util/uploadToHastebin');
const handleDatabaseError = require('../Util/handleDatabaseError');

class Evaluate extends BaseCommand {
	constructor(bot, r) {
		super({
			command: 'eval',
			aliases: [
				'run'
			],
			description: 'Runs JavaScript code within the process.',
			category: 'Developers',
			usage: 'eval <code...>',
			hidden: true
		});
		this.bot = bot;
		this.r = r;
	}

	execute(msg, args) {
		this.r.table('developers').get(msg.author.id).run(async (error, developer) => {
			if (error) return handleDatabaseError(error, msg);
			if (!developer) return msg.channel.createMessage(':no_entry_sign:   **»**   You do not have permission to run this command.');
			try {
				let result = await eval(args.join(' '));
				result = util.inspect(result);
				if (result.length <= 1992) return msg.channel.createMessage('```js\n' + result + '```');
				uploadToHastebin(result).then((url) => {
					msg.channel.createMessage(':outbox_tray:   **»**   ' + url);
				}).catch((error) => {
					msg.channel.createMessage(':exclamation:   **»**   Failed to upload result to hastebin. `' + error.message + '`');
				});
			} catch (e) {
				msg.channel.createMessage('```js\n' + e + '```');
			}
		});
	}
}

module.exports = Evaluate;