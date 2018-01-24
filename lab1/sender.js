const net = require('net');
const prompt = require('prompt');
const config = require('./config');
let client = new net.Socket();

client.connect(config.port, () => {
    console.log('======= Sender is connected =======');

});

client.on('data', (data) => {
    let message = JSON.parse(data);
    console.log('\rMessage from broker: ' + JSON.stringify(message, null, 2));
});

client.on('close', () => {
    console.log('\nConnection closed');
});

client.on('error', (err) => {
    console.log(err);
});

setTimeout(() => {
    showPrompt();
}, 600);


function showPrompt() {
    console.log('Type 1 for creating queue');
    console.log('Type 2 to see all queues');
    console.log('Type 3 to push in specific queue');

    prompt.start();
    prompt.message = 'Type your command';

    prompt.get(['number'], (err, input) => {
        try {
            switch (Number(input.number)) {
                case 1: {
                    createQueue();
                    break;
                }
                case 2: {
                    showAllQueues();
                    break;
                }
                case 3: {
                    sendToSpecificQueue();
                    break;
                }
                default:
                    console.log('Something went wrong');
                    showPrompt();

            }
        } catch (err) {
            console.log(err);
        }
    });

}

function createQueue() {
    prompt.start();
    prompt.message = 'Write queue name';
    prompt.get(['name'], (err, input) => {
        if (input.name !== '') {
            let data = {
                name: input.name,
                type: 'createQueue'
            };
            client.write(JSON.stringify(data));
            showPrompt();

        } else {
            console.log('Your entry is empty');
            showPrompt();
        }
    });
}

function showAllQueues() {
    let data = {
        type: 'getQueueList'
    };
    client.write(JSON.stringify(data));
    setTimeout(() => {
        showPrompt();
    }, 600);


}

function sendToSpecificQueue() {
    prompt.start();
    prompt.message = 'Send in queue';
    prompt.get(['queue', 'message'], (err, input) => {
        if (input.message !== '') {
            let data = {
                queue: input.queue,
                message: input.message,
                type: 'postMessage'
            };
            client.write(JSON.stringify(data));
            showPrompt();
        } else {
            console.log('Your entry is empty');
            showPrompt();
        }
    });
}
