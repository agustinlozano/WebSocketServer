const WebSocket = require('ws');
const WebSocketServer = WebSocket.Server;
const config = require('./config');

// local
const wss = new WebSocketServer({ port: config.PORT })

// Define a global variable to store the last block data
const lastBlock = {
  code: '',
  projectId: '',
}

// WebSocket endpoint to set and deliver the last block data
wss.on('connection', function connection(ws) {
  // Send the current value of the last block data to the client
  ws.send(JSON.stringify(lastBlock));

  // Handle incoming messages
  ws.on('message', function incoming(data) {
    // Update the last block data
    const newData = JSON.parse(data)

    console.log('Received data: ', newData)

    lastBlock.code = newData.code
    lastBlock.projectId = newData.projectid

    // Send the updated value of the last block data to all connected clients
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(lastBlock));
      }
    });
  });
});

console.log('WebSocket server started')