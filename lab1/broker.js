const fs = require('fs');
const net = require('net');
const config = require('./config.json');

let server = net.createServer(onClientConnected);

const ADDRESS = config.host;
const PORT = config.port;

server.listen(PORT, ADDRESS);
console.log('======= Broker is on =======');
let generalQueue = fs.readFileSync('storage.txt').toString().split(',');
let queueList = [];

function onClientConnected(socket) {

    // Giving a name to this client
    let clientName = `${socket.remoteAddress}:${socket.remotePort}`;

    // Logging the message on the server
    console.log(`${clientName} connected.`);

    // Triggered on data received by this client
    socket.on('data', (data) => {
        let input = JSON.parse(data);

        switch (input.type) {
            case 'general':

                if (generalQueue.length > 0) {
                    socket.write(JSON.stringify(generalQueue.pop()));
                } else {
                    socket.write(JSON.stringify('No messages in queue'));
                }
                break;
            case 'sendToQueue':
                if (input.queue) {
                    let elementPos = queueList.map((el) => {
                        return el.title;
                    }).indexOf(input.queue);
                    if (elementPos !== -1) {
                        queueList[elementPos].queue.pop();
                    } else {
                        socket.write(JSON.stringify('No such queue'));

                    }
                }
                break;
            case 'postMessage': {
                if (input.queue) {
                    let elementPos = queueList.map((el) => {
                        return el.title;
                    }).indexOf(input.queue);
                    console.log('this is elem', elementPos);
                    if (elementPos !== -1) {
                        queueList[elementPos].queue.push(input.message);
                    } else {
                        socket.write(JSON.stringify('No such queue'));

                    }
                }
                generalQueue.push(input.message);

                break;
            }
            case 'createQueue': {
                createNewQueue(input.name);
                break;
            }
            case 'getQueueList': {
                getQueueList(socket);
                break;
            }
            default:
                console.log('Something went wrong');
        }
        fs.writeFileSync('storage.txt', generalQueue);
        fs.writeFileSync('queueList.json', JSON.stringify(queueList));

    });


    socket.on('error', () => {
        console.log('errror');
    });

    socket.on('end', () => {

        // Logging this message on the server
        console.log(`${clientName} disconnected.`);
    });

}

function createNewQueue(text) {
    queueList.push({
        title: text,
        queue: []
    });
}

function getQueueList(socket) {
    if (queueList.length > 0) {
        socket.write(JSON.stringify(queueList));
    } else {
        socket.write(JSON.stringify('No queues'));
    }
}

