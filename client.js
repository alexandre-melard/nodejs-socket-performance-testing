/**
 * call using a distinct arg for each client
 */
var net = require('net');

var client = new net.Socket();
var date;
var myArgs = process.argv.slice(2);

// Watch the async keyword !
async function hello() {
    console.log("sending data");
    while (true) {
        // Wait 1ms
        await new Promise(resolve => setTimeout(resolve, 1));
        // register the date
        date = new Date().getTime()
        // Send the data with the program argument to know who is writing
        client.write(date + ` Hello, server! Love, Client ${myArgs[0]}.`);
    }
}

client.connect(1337, '127.0.0.1', function() {
	console.log('Connected');
    // need to be async
    hello();
});

client.on('data', function(data) {
    // Check time from sent to receive
	console.log((new Date().getTime() - date) + 'ms Received: ' + data);
});

client.on('close', function() {
	console.log('Connection closed');
	client.destroy(); // kill client after server's response
});