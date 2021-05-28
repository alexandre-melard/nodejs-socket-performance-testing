
class MessageBuffer {
  constructor(delimiter) {
    this.delimiter = delimiter;
    this.buffer = "";
  }

  ready() {
    return !(
      this.buffer.length === 0 ||
      this.buffer.indexOf(this.delimiter) === -1
    );
  }

  push(data) {
    this.buffer += data;
  }

  getMessage() {
    const delimiterIndex = this.buffer.indexOf(this.delimiter);
    if (delimiterIndex !== -1) {
      const message = this.buffer.slice(0, delimiterIndex);
      this.buffer = this.buffer.replace(message + this.delimiter, "");
      return message;
    }
    return null;
  }

  handleData() {
    /**
     * Try to accumulate the buffer with messages
     *
     * If the server isnt sending delimiters for some reason
     * then nothing will ever come back for these requests
     */
    const message = this.getMessage();
    return message;
  }
}

let net = require('net');
let num = 0;
let sockets = new Map();
const STATS_DELAY = 10000;

async function readData(id, data) {
  let socket = sockets.get(id);
  socket.buffer.push(data);
  if (socket.buffer.ready()) {
    const message = socket.buffer.handleData()
    let stats = socket.stats;
    if (!socket.name) {      
      const name = message.replace(this.delimiter, '');
      socket.name = name;
      console.log(`setting name: ${socket.name}, message: ${message}`);
    }
    stats.received++;
    stats.lastReceived++;
    sockets.forEach(async (s) => {
      if (s.id != id) {
        s.socket.write(data);
        stats.sent++;
        stats.lastSent++;
      }
    });
  }
}

function avgSpeed(num) {
  return Math.round(num * 1000 / STATS_DELAY);
}

async function stats() {
  while (true) {
    await new Promise(resolve => setTimeout(resolve, STATS_DELAY));
    if (sockets.size == 0) {
      console.log('waiting for client to connect');
    }
    sockets.forEach((socket) => {
      let stats = socket.stats;
      console.log(`client ${socket.name} received ${avgSpeed(stats.lastReceived)} msg/s and sent ${avgSpeed(stats.lastSent)} msg/s [s: ${stats.sent}, r: ${stats.received}]`);
      stats.lastReceived = 0;
      stats.lastSent = 0;
    });
  }
}

let server = net.createServer(function (socket) {
  let id = num;
  console.log(socket)
  sockets.set(id, {
    'name': undefined,
    'socket': socket,
    'buffer': new MessageBuffer("\n"),
    'stats': {
      'received': 0,
      'sent': 0,
      'lastReceived': 0,
      'lastSent': 0
    }
  });
  socket.write(`Echo server ${num}\r\n`);
  num += 1;
  socket.on('error', (e) => console.log(e));
  socket.on('data', (d) => readData(id, d));
});



server.listen(1337, '127.0.0.1');
stats();
