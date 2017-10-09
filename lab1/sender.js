let net = require("net");
let prompt = require('prompt');
let colors = require("colors/safe");

let client = new net.Socket();

client.connect(5000, function () {
	console.log('Connected');

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
	prompt.message = colors.rainbow("Message: ");
	prompt.get(['text'], function (err, result) {
		if (err) {
			console.log(err);
		}
		if (result.text !== "") {
			// Send to broker
			let mess = {type: "post", text: result.text};
			client.write(JSON.stringify(mess));
			console.log("Message Sent!\n");
			showPrompt();
		} else {
			console.log("Write a message.");
			showPrompt();
		}
	});
}