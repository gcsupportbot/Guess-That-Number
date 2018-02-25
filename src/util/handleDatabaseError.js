module.exports = (error, msg) => {
	if (msg) msg.channel.createMessage(':exclamation: │ An unexpected error occured when attempting to execute query in database.');
	console.error('Failed to query the database.', error);
};