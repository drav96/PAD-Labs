let net = require('net');
let prompt = require('prompt');
let client = new net.Socket();
const config = require('./config');


client.connect(config.port, function () {
    console.log('======= Receiver connected =======');
    console.log('Type 1 to see all queue');
    console.log('Type 2 to get message from general queue');
    console.log('Type 3 to get message from specifc queue');

});
client.on('data', (data) => {
    let msg = JSON.parse(data);
    console.log('\rReceived message: ' + msg);
});
client.on('close', function () {
    console.log('Connection closed');
});

client.on('error', function (err) {
    console.log(err);
});

let showPromptTimeout = () => {
    return setTimeout(function () {
        showPrompt();
    }, 600);
};

showPromptTimeout();


function showPrompt() {
    prompt.start();
    prompt.message = 'Type your command';

    prompt.get(['number'], (err, input) => {
        try {
            switch (Number(input.number)) {
                case 1: {
                    showAllQueues();
                    break;
                }
                case 2: {
                    getMessageFromGeneralQueue();
                    break;
                }
                case 3: {
                    getMessageFromSpecificQueue();
                    break;
                }
                default:
                    console.log('Something went wrong');
            }
        } catch (err) {
            console.log(err);
        }
    });

}

function getMessageFromGeneralQueue() {
    prompt.start();
    prompt.message = 'Get message from queue';
    prompt.get(['type'], (err, input) => {
        if (input.name !== '') {
            let data = {
                name: input.name,
                type: 'general'
            };
            client.write(JSON.stringify(data));
            showPromptTimeout();
        } else {
            console.log('Your entry is empty');
            showPromptTimeout();
        }
    });
}

function showAllQueues() {
    let data = {
        type: 'getQueueList'
    };
    client.write(JSON.stringify(data));
    showPromptTimeout();

}

function getMessageFromSpecificQueue() {
    prompt.start();
    prompt.message = 'Get message from';
    prompt.get(['queue'], (err, input) => {
        if (input.name !== '') {
            let data = {
                name: input.name,
                type: 'getFromQueue'
            };
            client.write(JSON.stringify(data));
            showPromptTimeout();
        } else {
            console.log('Your entry is empty');
            showPromptTimeout();
        }
    });
}

