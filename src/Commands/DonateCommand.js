const BaseCommand = require('../Structure/BaseCommand');
const config = require('../config.json');

class Donate extends BaseCommand {
	constructor(bot, r) {
		super({
			command: 'donate',
			aliases: [
				'patreon'
			],
			description: 'Get the donation links to support the creator.',
			category: 'Utility',
			usage: 'donate',
			hidden: false
		});
		this.bot = bot;
		this.r = r;
	}

	execute(msg) {
		msg.channel.createMessage({
			embed: {
				title: 'Donation Rewards',
				color: 3066993,
				description: 'Donating will help the bot stay alive, and significantly improve it\'s performance when performing various tasks. Donating will also give you some sweet perks within our bots, as listed below.'
					+ '\n\n**Tier 1 - $2**\n```md\n* Custom Donator role on the official support server\n* Access to the donator-only chat on the official support server```'
					+ '\n**Tier 2 - $5**\n```md\n* All previous rewards.\n* A custom command for only you to use! (Prisma)\n* Ability to adjust volume higher than 100%. (Prisma)\n* Ability to infinitely repeat a song. (Prisma)```'
					+ '\n**Tier 3 - $10**\n```md\n* All previous rewards.\n* A second custom command. (Prisma)\n* Your custom command will now be public. (Prisma)\n* Queue limit increased from 25 to 100. (Prisma)\n* Song length limit increased from 30 minutes to 6 hours. (Prisma)```'
					+ '\n**Tier 4 - $15**\n```md\n* All previous rewards.\n* Your best leaderboard scores won\'t be removed when the reset occurs. (Guess That Number)```'
					+ '\n**Tier 5 - $25**\n```md\n* There are no special rewards for this, but you will be greatly benefiting the developer and paying for the host.```'
					+ '\nYou can donate on Patreon using the following link: ' + config.links.patreon
			}
		});
	}
}

module.exports = Donate;