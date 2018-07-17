const humanizeDuration = require('humanize-duration');
const BaseCommand = require('../Structure/BaseCommand');
const handleDatabaseError = require('../Util/handleDatabaseError');

class Event extends BaseCommand {
	constructor(bot, r) {
		super({
			command: 'event',
			aliases: [],
			description: 'Start or manage events running in a channel.',
			category: 'Game',
			usage: 'event start|status|end [<maximum>]',
			hidden: false
		});
		this.bot = bot;
		this.r = r;
	}

	execute(msg, args) {
		if (!msg.channel.guild) return msg.channel.createMessage(':exclamation:   **»**   You cannot use this command in a direct message.');
		if (args.length < 1) return msg.channel.createMessage({
			embed: {
				title: 'Error!',
				color: 0xE50000,
				description: 'Missing `start|status|end` option.'
			}
		});
		if (args[0].toLowerCase() === 'start') {
			this.r.table('developers').get(msg.author.id).run((error, developer) => {
				if (error) return handleDatabaseError(error, msg);
				if (!msg.member.permission.has('manageMessages') && !developer) return msg.channel.createMessage(':no_entry_sign:   **»**   You do not have permission to execute this command. You must have the `Manage Messages` permission.');
				this.r.table('events').get(msg.channel.id).run((error, event) => {
					if (error) return handleDatabaseError(error, msg);
					if (event) return msg.channel.createMessage(':exclamation:   **»**   There is already an event running in this channel. Use `' + msg.prefix + 'event end` before starting another one.');
					if (args.length < 2) return msg.channel.createMessage(':question:   **»**   You must provide a maximum number to guess to.');
					if (isNaN(args[1])) return msg.channel.createMessage(':exclamation:   **»**   The maximum number must be a valid number.');
					if (Number(args[1]) < 1000) return msg.channel.createMessage(':exclamation:   **»**   The minimum for the maximum number must be above 1,000.');
					this.r.table('events').insert({
						id: msg.channel.id,
						number: Math.floor(Math.random() * Number(args[1])),
						start: Date.now(),
						starter: msg.author.id,
						maximum: Number(args[1]),
						guesses: []
					}).run((error) => {
						if (error) return handleDatabaseError(error, msg);
						this.bot.events.set(msg.channel.id, true);
						msg.channel.createMessage(':white_check_mark:   **»**   Successfully created an event. The number ranges from `0` to `' + Number(args[1]).toLocaleString() + '`, and everyone can participate. If you want to cancel this event, type `' + msg.prefix + 'event end`. Good luck!');
					});
				});
			});
		} else if (args[0].toLowerCase() === 'status') {
			this.r.table('events').get(msg.channel.id).run((error, event) => {
				if (error) return handleDatabaseError(error, msg);
				if (!event) return msg.channel.createMessage(':exclamation:   **»**   There are no events running within this channel.');
				msg.channel.createMessage({
					embed: {
						title: 'Event Status',
						color: this.bot.embedColor,
						fields: [
							{
								name: 'Guesses',
								value: event.guesses.length,
								inline: false
							},
							{
								name: 'Time Since Start',
								value: humanizeDuration(Date.now() - event.start),
								inline: false
							}
						]
					}
				});
			});
		} else if (args[0].toLowerCase() === 'end') {
			this.r.table('developers').get(msg.author.id).run((error, developer) => {
				if (error) return handleDatabaseError(error, msg);
				this.r.table('events').get(msg.channel.id).run((error, event) => {
					if (error) return handleDatabaseError(error, msg);
					if (!event) return msg.channel.createMessage(':exclamation:   **»**   There are no events running within this channel.');
					if (event.starter !== msg.author.id && !developer) return msg.channel.createMessage(':exclamation:   **»**   Only the original event starter can cancel this event. Their ID is `' + event.starter + '`.');
					this.r.table('events').get(msg.channel.id).delete().run((error) => {
						if (error) return handleDatabaseError(error, msg);
						const closest = event.guesses.sort((a, b) => {
							if (a.offset > b.offset) return 1;
							if (b.offset > a.offset) return -1;
							return 0;
						})[0];
						this.bot.events.delete(msg.channel.id);
						msg.channel.createMessage(':white_check_mark:   **»**   Successfully ended event after `' + humanizeDuration(Date.now() - event.start) + '`. There were a total of `' + event.guesses.length + '` guesses, but the closest guess is awarded to `' + closest.tag + ' (' + closest.id + ')` for their guess of `' + closest.guess.toLocaleString() + '` which was `' + closest.offset.toLocaleString() + '` away from the random number. The random number was `' + event.number.toLocaleString() + '`. Good job to all `' + new Set(event.guesses.map((guess) => guess.id)).size + '` participants.');
					});
				});
			});
		} else if (args[0].toLowerCase() === 'guess') {
			// used interally for the message handler, no message should be displayed
			this.r.table('events').get(msg.channel.id).run((error, event) => {
				if (error) return handleDatabaseError(error);
				if (!event) return;
				if (args.length < 2) return;
				if (isNaN(args[1])) return;
				if (event.number === Number(args[1])) {
					this.r.table('events').get(msg.channel.id).delete().run((error) => {
						if (error) return handleDatabaseError(error);
						msg.channel.createMessage(':tada:   **»**   Congratulations to `' + msg.author.username + '#' + msg.author.discriminator + '`, you have guessed the correct number of `' + event.number.toLocaleString() + '`. There were a total of `' + (event.guesses.length + 1).toLocaleString() + '` guesses over a span of `' + humanizeDuration(Date.now() - event.start, { round: true }) + '`. Good job to all `' + new Set(event.guesses.map((guess) => guess.id)).size + '` participants!');
					});
				} else {
					this.r.table('events').get(msg.channel.id).update({
						guesses: this.r.row('guesses').append({
							id: msg.author.id,
							guess: Number(args[1]),
							offset: Math.abs(event.number - Number(args[1])),
							tag: msg.author.username + '#' + msg.author.discriminator
						})
					}).run((error) => {
						if (error) return handleDatabaseError(error);
					});
				}
			});
		}
	}
}

module.exports = Event;