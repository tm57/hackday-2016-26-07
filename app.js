const PORT = 8080;
var fs = require('fs');
var Game = require('./server/app/game');
var Names = require('./server/app/partner/names');
var winston = require('./server/app/log');
var _ = require('underscore');

function handler(request, response) {

	var file = __dirname + (request.url == '/' ? '/client/index.html' : request.url);

	fs.readFile(file, function (error, data) {
		if (error) {
			response.writeHead(500);
			return response.end('Error loading index.html');
		}
		response.writeHead(200);
		response.end(data, 'utf-8');
	});
}

var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);


app.listen(PORT, function () {
	console.log("Server listening on: http://localhost:%s", PORT);
});

var gameSetup = io.of('/setup');
var users = [];
var rooms = [];

winston = new winston();
gameSetup.on('connection', function (socket) {

	socket.on('looking_for_partner', function (data) {
		socket.username = data.username;
		socket.foundPartner = data.foundPartner;
		var temp1 = socket;
		users.push(socket);

		var waitingUser = {};
		var waitingUserIndex = 0;
		for (var i = 0; i < users.length; i++) {
			if (users[i].foundPartner == false) {
				waitingUser = users[i];
				waitingUserIndex = i;
				break;
			}
		}

		for (i = 0; i < users.length; i++) {
			if (users[i].foundPartner == false && socket.foundPartner == false && users[i].username !== socket.username) {
				socket.foundPartner = waitingUser.username;
				var room = socket.foundPartner+socket.username;
				socket.room = room;
				users[waitingUserIndex].room = room;
				socket.join(room);
				users[waitingUserIndex].join(room);

				socket.to(room).emit('ballPosition', {opponentName: socket.username, currentPlayerUsername: waitingUser.username, room:room, boardPosition: 'left'});
				users[waitingUserIndex].to(room).emit('ballPosition', {opponentName: waitingUser.username, currentPlayerUsername: socket.username, room:room, boardPosition: 'right'});
				users = _.without(users, users[i], temp1);
				winston.log({Gamers: {leftPlayer: waitingUser.username, rightPlayer: socket.username}});
				break;
			}
		}


	});

	socket.on('move', function (data) {
		winston.log(data);
		socket.to(socket.room).emit('move', data);
	});
	//Disconnect a client
	socket.on('disconnect', function () {
		winston.log('User ' + socket.username + ' has left the game');
	});

});

