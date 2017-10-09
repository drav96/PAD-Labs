const net = require('net');
const PORT = 5000;
const ADDRESS = '127.0.0.1';
let fs = require('fs');

let server = net.createServer(onClientConnected);
server.listen(PORT, ADDRESS);

let messages = fs.readFileSync('array.txt').toString().split(",");

function onClientConnected(socket) {
	// Giving a name to this client
	let clientName = `${socket.remoteAddress}:${socket.remotePort}`;

	// Logging the message on the server
	console.log(`${clientName} connected.`)

	// Triggered on data received by this client
	socket.on('data', (data) => {
		let msg;
		msg = JSON.parse(data);
		if (msg.type === "get") {
			if (messages.length > 0) {
				socket.write(JSON.stringify(messages.pop()))
			} else {
				socket.write(JSON.stringify("No messages in queue"))
			}
		}

		if (msg.type === "post") {
			messages.push(msg.text)
		}
		fs.writeFile('array.txt', messages, (data) => {
		});
		console.log(messages);
	});

	socket.on('error', () => {
		console.log("errror")
	});
	socket.on('end', () => {
		// Logging this message on the server
		console.log(`${clientName} disconnected.`);
	});
}

console.log("Server is on");

