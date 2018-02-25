class Command {
	constructor(args) {
		for (const prop in args) {
			if (args.hasOwnProperty(prop)) {
				this[prop] = args[prop];
			}
		}
	}
}

module.exports = Command;