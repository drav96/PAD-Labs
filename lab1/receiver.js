let net = require('net');
let prompt = require('prompt');
let client = new net.Socket();


client.connect(5000, function () {
    console.log('======= Receiver connected =======');

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
    }, 500);
};

showPromptTimeout();

function showPrompt() {
    prompt.start();
    prompt.message = 'Type get in order to get a message';
    prompt.get(['command'], function (err, result) {
        if (err) {
            console.log(err);
        }

        let getMessage = {type: result.command};

        if (result.type !== '') {
            client.write(JSON.stringify(getMessage));
            showPromptTimeout();
        } else {
            console.log('Your entry is empty');
            showPromptTimeout();
        }

    });
}

