const child_process = require('child_process');
const BaseCommand = require('../Structure/BaseCommand');
const uploadToHastebin = require('../Util/uploadToHastebin');
const handleDatabaseError = require('../Util/handleDatabaseError');

class Execute extends BaseCommand {
	constructor(bot, r) {
		super({
			command: 'exec',
			aliases: [
				'bash'
			],
			description: 'Executes command in the host console.',
			category: 'Developers',
			usage: 'exec <command...>',
			hidden: true
		});
		this.bot = bot;
		this.r = r;
	}

	execute(msg, args) {
		this.r.table('developers').get(msg.author.id).run(async (error, developer) => {
			if (error) return handleDatabaseError(error, msg);
			if (!developer) return msg.channel.createMessage(':no_entry_sign:   **»**   You do not have permission to run this command.');
			child_process.exec(args.join(' '), (error, stdout, stderr) => {
				const result = stderr || stdout;
				if (result.length <= 1992) return msg.channel.createMessage('```bash\n' + result + '```');
				uploadToHastebin(result).then((url) => {
					msg.channel.createMessage(':outbox_tray:   **»**   ' + url);
				}).catch((error) => {
					msg.channel.createMessage(':exclamation:   **»**   Failed to upload result to hastebin. `' + error.message + '`');
				});
			});
		});
	}
}

module.exports = Execute;