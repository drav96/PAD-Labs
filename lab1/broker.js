const fs = require('fs');
const net = require('net');
const config = require('./config.json');

let server = net.createServer(onClientConnected);

const ADDRESS = config.host;
const PORT = config.port;

server.listen(PORT, ADDRESS);
console.log('======= Broker is on =======');

let messages = fs.readFileSync('storage.txt').toString().split(',');


async function onClientConnected(socket) {

    // Giving a name to this client
    let clientName = `${socket.remoteAddress}:${socket.remotePort}`;

    // Logging the message on the server
    console.log(`${clientName} connected.`);

    // Triggered on data received by this client
    socket.on('data', (data) => {
        let msg = JSON.parse(data);
        switch (msg.type) {
            case 'get':
                if (messages.length > 0) {
                    socket.write(JSON.stringify(messages.pop()));
                } else {
                    socket.write(JSON.stringify('No messages in queue'));
                }
                break;
            case 'post': {
                messages.push(msg.text);
                break;
            }
            default:
                console.log('Something went wrong');
        }
        console.log(messages);

    });

    fs.writeFileSync('storage.txt', messages);

    socket.on('error', () => {
        console.log('errror');
    });

    socket.on('end', () => {
        // Logging this message on the server
        console.log(`${clientName} disconnected.`);
    });

}

