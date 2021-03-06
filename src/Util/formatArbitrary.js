const config = require('../config.json');

module.exports = (data) => {
	data = data.replace(new RegExp(config.token, 'g'), '-- SENSITIVE INFORMATION --');
	data = data.replace(new RegExp(config.rethinkdb.password, 'g'), '-- SENSITIVE INFORMATION --');
	for (const key in config.api_keys) {
		data = data.replace(new RegExp(config.api_keys[key], 'g'), '-- SENSITIVE INFORMATION --');
	}
	return data;
};