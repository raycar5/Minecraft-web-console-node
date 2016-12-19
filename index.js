var express = require('express')
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var childp = require("child_process");
var Writable = require('stream').Writable
var EOL = require('os').EOL;
var fs = require('fs');
var config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

var ps = null;
var socketOutputStream = Writable({ decodeStrings: false });
socketOutputStream._write = (data,enc,next)=>{
	io.sockets.emit("output",ab2str(data));
	next();
};


app.use(express.static("static"));
server.listen(config.port);
io.on('connection', function (socket) {
	socket.emit("serverStatus",ps === null ? "stopped": "started");
	socket.on("input",(data)=>{
		if(ps !== null){
			ps.stdin.write(data + EOL);
		}
	});
	socket.on("startServer",()=>{
		if(!ps){
			ps = childp.spawn(config.launchScript);
			io.sockets.emit("serverStatus","started");
			ps.stdout.pipe(socketOutputStream);
			ps.on("exit",()=>{
				io.sockets.emit("serverStatus","stopped");
				ps.stdout.unpipe(socketOutputStream);
				ps = null;
			});
		}
	});
	socket.on("stopServer",()=>{
		if(ps){
			ps.stdin.write("save-all" + EOL);
			ps.stdin.write("stop" + EOL);
			ps.stdin.end()
		}
	});
});

function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint16Array(buf));
}