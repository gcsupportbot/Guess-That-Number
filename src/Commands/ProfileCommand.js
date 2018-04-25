const BaseCommand = require('../Structure/BaseCommand');
const handleDatabaseError = require('../Util/handleDatabaseError');

class Profile extends BaseCommand {
	constructor(bot, r) {
		super({
			command: 'profile',
			aliases: [],
			description: 'View the profile of yourself or another user.',
			category: 'Game',
			usage: 'profile [<user...>]',
			hidden: false
		});
		this.bot = bot;
		this.r = r;
	}

	execute(msg) {
		this.r.table('user_statistics').get(msg.author.id).run((error, user) => {
			if (error) return handleDatabaseError(error, msg);
			msg.channel.createMessage({
				embed: {
					title: 'Your Profile',
					color: 3066993,
					thumbnail: {
						url: msg.author.avatarURL
					},
					description: 'You can purchase things to display on your profile within the `' + msg.prefix + 'shop`.',
					fields: [
						{
							name: 'Coins',
							value: user ? user.coins : 0,
							inline: true
						}
					]
				}
			});
		});
	}
}

module.exports = Profile;