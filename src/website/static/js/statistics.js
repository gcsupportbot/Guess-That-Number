(function() {
	var socket = io.connect("//passthemayo.space/guess-that-number/", { secure: false });
	var servers = document.getElementById("servers");
	var users = document.getElementById("users");
	var channels = document.getElementById("channels");
	var commands = document.getElementById("commands");
	var uptime = document.getElementById("uptime");
	
	socket.on("stats", function(data) {
		servers.innerText = data.servers;
		users.innerText = data.users;
		channels.innerText = data.channels;
		commands.innerText = data.commands;
		uptime.innerText = data.uptime;
	});
})();