const table = require('table').table;

module.exports = {
	command: 'shards',
	aliases: [],
	category: 'Utility',
	description: 'View all of the shards within the bot.',
	usage: 'shards',
	execute: (bot, r, msg) => {
		const data = [
			[
				'ID',
				'Status',
				'Guilds',
				'Users',
				'Ping'
			],
			...bot.shards.map((s) => [
				s.id + (msg.channel.guild ? bot.guildShardMap[msg.channel.guild.id] === s.id ? ' (current)' : '' : ''),
				s.status.toUpperCase(),
				Object.keys(bot.guildShardMap).filter((id) => bot.guildShardMap[id] === s.id).length,
				new Set([].concat.apply([], Object.keys(bot.guildShardMap).map((id) => bot.guilds.get(id).members.map((m) => m.id)))).size,
				s.latency + 'ms'
			])
		];
		msg.channel.createMessage('```\n' + table(data, {
			border: {
				topBody: '',
				topJoin: '',
				topLeft: '',
				topRight: '',
				bottomBody: '',
				bottomJoin: '',
				bottomLeft: '',
				bottomRight: '',
				bodyLeft: '',
				bodyRight: '',
				bodyJoin: ' ',
				joinBody: '-',
				joinLeft: '',
				joinRight: '',
				joinJoin: ' '
			}
		}) + '```');
	}
};