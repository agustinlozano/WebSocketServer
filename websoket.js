const WebSocket = require('ws');
const WebSocketServer = WebSocket.Server;
const config = require('./config/main.json');
const { normalize } = require('./utils');

const wss = new WebSocketServer({ port: config.PORT })

console.log({config})

// Define a global variable to store the last block data
const lastBlock = {
  code: '',
  projectId: '',
}

// WebSocket endpoint to set and deliver the last block data
wss.on('connection', function connection(ws) {
  // Send the current value of the last block data to the client
  ws.send(JSON.stringify(lastBlock));

  const interval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.ping()
    }
  }, 30000)

  ws.on('pong', () => {
    console.log('pong, client is alive')
  })

  ws.on('close', () => {
    clearInterval(interval)
  })

  // Handle incoming messages
  ws.on('message', function incoming(data) {
    // Update the last block data
    const newData = JSON.parse(data)
    const validData = normalize(newData)

    if (!validData) {
      throw new Error('Invalid data')
    }

    console.log('\nReceived data: ', validData)

    // lastBlock.set(validData)
    lastBlock.code = validData.code
    lastBlock.projectId = validData.projectid

    // Send the updated value of the last block data to all connected clients
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(lastBlock));
      }
    });
  });
});

console.log(`\nWebSocket server started running on, port: ${config.PORT} \n`)
