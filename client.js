/**
 * call using a distinct arg for each client
 */
let net = require('net');
let client = new net.Socket();
let date;
let myArgs = process.argv.slice(2);
let sent = 0;
let lastSent = 0;
let received = 0;
let lastReceived = 0;
let delay=0;
const STATS_DELAY = 10000;

async function stats() {
    while (true) {
        await new Promise(resolve => setTimeout(resolve, STATS_DELAY));
        console.log(`received: ${lastReceived}, sent ${lastSent} in last ${STATS_DELAY} [s: ${sent}, r: ${received}, avg: ${(delay/lastReceived).toFixed(2)}ms]`);
        lastReceived = 0;
        lastSent = 0;
        delay = 0;
    }
}

// Watch the async keyword !
async function hello() {
    console.log("sending data");
    while (true) {
        // Wait 1ms
        await new Promise(resolve => setTimeout(resolve, 1));
        // register the date
        date = new Date().getTime()
        // Send the data with the program argument to know who is writing
        client.write(`${myArgs[0]}\n`);
        sent++;
        lastSent++;
    }
}

client.connect(1337, '127.0.0.1', function () {
    console.log('Connected');
    // need to be async
    hello();
});

client.on('data', function (data) {
    // Check time from sent to receive
    delay+=new Date().getTime() - date
    received++;
    lastReceived++;
});

client.on('close', function () {
    console.log('Connection closed');
    client.destroy(); // kill client after server's response
});

stats();