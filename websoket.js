const WebSocket = require('ws');
const WebSocketServer = WebSocket.Server;
const config = require('./config/main.json');

const wss = new WebSocketServer({ port: config.PORT })

// Define a global variable to store the last block data
// const lastBlock = {
//   code: '',
//   projectId: '',
// }

// now we can make the code robust, turn lastBlock into a class
// and add methods to it to update the data and send it to all clients
class LastBlock {  
  constructor() {
    this.code = ''
    this.projectId = ''
  }

  get() {
    return {
      code: this.code,
      projectId: this.projectId,
    }
  }

  set(data) {
    this.code = data.code
    this.projectId = data.projectid
  }

  update(data) {
    this.code = data.code
    this.projectId = data.projectid

    // Send the updated value of the last block data to all connected clients
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(lastBlock));
      }
    });
  }
}

const lastBlock = new LastBlock()

// WebSocket endpoint to set and deliver the last block data
wss.on('connection', function connection(ws) {
  // Send the current value of the last block data to the client
  ws.send(JSON.stringify(lastBlock));

  // Handle incoming messages
  ws.on('message', function incoming(data) {
    // Update the last block data
    const newData = JSON.parse(data)

    console.log('Received data: ', newData)

    lastBlock.set(newData)

    // Send the updated value of the last block data to all connected clients
    lastBlock.update(newData)
  });
});

console.log('WebSocket server started running on', config.PORT)