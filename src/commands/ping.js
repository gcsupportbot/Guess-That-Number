module.exports = {
	command: 'ping',
	aliases: [],
	category: 'General',
	description: 'See how long it takes to ping the bot.',
	usage: 'ping',
	execute: (bot, r, msg) => {
		const start = Date.now();
		msg.channel.createMessage(':ping_pong: │ Pinging...').then((m) => m.edit(':ping_pong: │ Pong! It took `' + (Date.now() - start) + 'ms` to send this message.'));
	}
};