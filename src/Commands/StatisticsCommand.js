const snekfetch = require('snekfetch');
const BaseCommand = require('../Structure/BaseCommand');
const formatSize = require('../Util/formatSize');
const formatDuration = require('../Util/formatDuration');
const handleDatabaseError = require('../Util/handleDatabaseError');
const Logger = require('../Util/Logger');

class Statistics extends BaseCommand {
	constructor(bot, r) {
		super({
			command: 'statistics',
			aliases: [
				'stats'
			],
			description: 'Sends detailed information about this bot.',
			category: 'Utility',
			usage: 'statistics',
			hidden: false
		});
		this.bot = bot;
		this.r = r;
	}

	execute(msg) {
		snekfetch.get('https://api.github.com/repos/PassTheMayo/Guess-That-Number/commits').then((result) => {
			this.r.table('games').count().run((error, games) => {
				if (error) return handleDatabaseError(error, msg);
				msg.channel.createMessage({
					embed: {
						title: 'Bot Statistics',
						color: this.bot.embedColor,
						description: result.body.slice(0, 3).map((commit) => '[`' + commit.sha.substr(0, 7) + '`](' + commit.commit.url + ') ' + commit.commit.message).join('\n'),
						fields: [
							{
								name: 'Shards',
								value: this.bot.shards.size,
								inline: true
							},
							{
								name: 'Guilds',
								value: this.bot.guilds.size,
								inline: true
							},
							{
								name: 'Users',
								value: this.bot.users.size,
								inline: true
							},
							{
								name: 'Memory Usage',
								value: formatSize(process.memoryUsage().heapUsed),
								inline: true
							},
							{
								name: 'Uptime',
								value: formatDuration(this.bot.uptime),
								inline: true
							},
							{
								name: 'Active Games',
								value: games,
								inline: true
							}
						]
					}
				});
			});
		}).catch((error) => {
			msg.channel.createMessage(':exclamation:   **»**   Failed to run the command. This incident has been reported.');
			Logger.error('Failed to get Equinox commits', error);
		});
	}
}

module.exports = Statistics;