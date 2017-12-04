const net = require('net');
const prompt = require('prompt');
const config = require('./config');
let client = new net.Socket();

client.connect(config.port, () => {
    console.log('======= Sender is connected =======');

});

client.on('close', () => {
    console.log('Connection closed');
});

client.on('error', (err) => {
    console.log(err);
});

setTimeout(() => {
    showPrompt();
}, 600);

function showPrompt() {
    prompt.start();
    prompt.message = 'Message to be sent';
    prompt.get(['text'], (err, result) => {
        if (err) {
            console.log(err);
        }
        if (result.text !== '') {

            // Send to broker
            let message = {
                type: 'post',
                text: result.text
            };

            client.write(JSON.stringify(message));
            console.log('\nMessage Sent!\n');

            showPrompt();
        } else {
            console.log('Your entry is empty');
            showPrompt();
        }
    });
}
