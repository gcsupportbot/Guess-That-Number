const humanizeDuration = require('humanize-duration');
const dateformat = require('dateformat');
const handleDatabaseError = require('../util/handleDatabaseError.js');
const config = require('../config.json');

module.exports = {
	command: 'raffle',
	aliases: [],
	category: 'Game',
	description: 'Participate in the raffle by ',
	usage: 'raffle [amount]',
	execute: (bot, r, msg, args) => {
		if (args.length > 0) {
			r.table('user_statistics').get(msg.author.id).run((error, user) => {
				if (error) return handleDatabaseError(error, msg);
				if (isNaN(args[0])) return msg.channel.createMessage(':exclamation: │ The bet amount must be a valid number.');
				if (Number(args[0]) < 50) return msg.channel.createMessage(':exclamation: │ You must bet at least 50 coins in order to raffle.');
				if (!user || Number(args[0]) > user.coins) return msg.channel.createMessage(':exclamation: │ You don\'t have that many coins to bet with.');
				r.table('user_statistics').get(msg.author.id).update({
					coins: user.coins - Number(args[0])
				}).run((error) => {
					if (error) return handleDatabaseError(error, msg);
					r.table('intervals').get('raffle').update({
						participants: r.row('participants').append({
							user: {
								username: msg.author.username,
								discriminator: msg.author.discriminator,
								id: msg.author.id
							},
							bet: Number(args[0]),
							timestamp: Date.now()
						})
					}).run((error) => {
						if (error) return handleDatabaseError(error, msg);
						msg.channel.createMessage(':moneybag: │ You\'ve successfully put ' + args[0] + ' coins into the raffle.');
					});
				});
			});
		} else {
			r.table('intervals').get('raffle').run((error, raffle) => {
				if (error) return handleDatabaseError(error, msg);
				msg.channel.createMessage({
					embed: {
						title: 'Raffle',
						description: 'Ends at: ' + dateformat(raffle.end_time, 'mm/dd/yyyy hh:MM:ss TT'),
						color: 3066993,
						fields: [
							{
								name: 'Participants',
								value: raffle.participants.length,
								inline: true
							},
							{
								name: 'Pot Size',
								value: raffle.participants.map((p) => p.bet).reduce((a, b) => a + b, 0).toLocaleString() + ' coins',
								inline: true
							},
							{
								name: 'Time Remaining',
								value: humanizeDuration(raffle.end_time - Date.now(), { round: true }),
								inline: true
							}
						],
						footer: {
							text: 'Use `' + (msg.channel.guild ? bot.prefixes.get(msg.channel.guild.id) : config.prefix) + 'raffle <amount>` to join the raffle.'
						}
					}
				});
			});
		}
	}
};