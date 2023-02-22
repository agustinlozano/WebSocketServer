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

module.exports = { lastBlock }
