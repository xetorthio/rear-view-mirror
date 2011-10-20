var io = require('socket.io');
var express = require('express'), app = express.createServer(), io = io.listen(app);

app.configure(function () {
	app.use(express.static(__dirname + '/public'));
	app.use(express.bodyParser());
});

app.post('*', function(req, res) {
	io.sockets.in(req.url).emit('notifications', req.body);
	res.send(200);
});

app.get('*', function(req, res) {
	res.send(' \
		<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" \
					"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"> \
		<html xmlns="http://www.w3.org/1999/xhtml"> \
		<head> \
			<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js"></script> \
			<script type="text/javascript" src="/socket.io/socket.io.js"></script> \
			<link rel="stylesheet" href="/jgrowl/jquery.jgrowl.css" type="text/css" /> \
			<script type="text/javascript" src="/jgrowl/jquery.jgrowl.js"></script> \
			<script type="text/javascript"> \
				var socket = io.connect("ec2-107-22-31-208.compute-1.amazonaws.com"); 		 \
                socket.on("connect", function() { \
					socket.emit("join", "'+req.url+'"); \
				}); \
				socket.on("notifications",function(data) { \
				  $.jGrowl(JSON.stringify(data)); \
				}); \
			</script> \
			<style type="text/css"> \
				h1{font-family:arial;font-size:14px;letter-spacing:2px;color:#222;font-weight:100;} \
			</style> \
		</head> \
		<body> \
		</body> \
		</html> \
	  ');
});
app.listen(8080);

// Add a connect listener
io.sockets.on('connection', function(socket) {
	socket.on('join', function(channel) {
		socket.join(channel);
	});
});

