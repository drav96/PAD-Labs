let net = require("net");
let prompt = require('prompt');
let client = new net.Socket();
let colors = require("colors/safe");


client.connect(5000, function () {
	console.log('Receiver connected');

});
client.on('data', (data) => {
	let msg = JSON.parse(data);
	console.log("\rReceived: " + msg);
});
client.on('close', function () {
	console.log('Connection closed');
});

client.on("error", function (err) {
	console.log(err);
});

setTimeout(function () {
	showPrompt();
}, 500);

function showPrompt() {
	prompt.start();
	prompt.message = colors.white("Message: ");
	prompt.get(['type', 'text'], function (err, result) {
		if (err) {
			console.log(err)
		}

		let msg = {type: result.type, text: result.text};

		if (result.type !== "") {
			client.write(JSON.stringify(msg));
			console.log("Message sent");
			console.log("\r");
			setTimeout(() => {
				showPrompt();
			}, 500);
		} else {
			console.log("Your entry is empty");
			setTimeout(() => {
				showPrompt();
			}, 500);
		}

	});
}

