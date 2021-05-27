var net = require('net');
var num = 0;
var sockets = []

// Async !
async function sendData(s, d) {
  s.write(d);
}

var server = net.createServer(function(socket) {
  console.log(socket)
  sockets.push(socket)
  socket.write(`Echo server ${num}\r\n`);  
  num += 1;
  socket.on('error', (e) => {
    console.log(e);
  });
  socket.on('data', d => {
    /* You might want to keep the foreach 
       to keep the message flow in line? */
    sockets.forEach(s => {
      if (s != socket) {
        sendData(s, d);
      }
    });
  })
});



server.listen(1337, '127.0.0.1');
