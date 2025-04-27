const WebSocket = require('ws');

class WebSocketServer {
  constructor(server) {
    this.wss = new WebSocket.Server({ server });
    this.clients = new Map(); // clientId -> ws connection
    
    this.wss.on('connection', (ws, req) => {
      console.log('New WebSocket connection');
      
      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message);
          console.log('WebSocket received message:', data);
          
          if (data.type === 'AUTH') {
            // Handle both user and restaurant authentication
            const clientId = data.role === 'restaurant' 
              ? `restaurant_${data.restaurantId}`
              : `user_${data.userId}`;
            
            this.clients.set(clientId, ws);
            console.log(`${data.role} ${clientId} connected`);
            console.log('Current clients:', Array.from(this.clients.keys()));
          }
        } catch (error) {
          console.error('WebSocket message error:', error);
        }
      });

      ws.on('close', () => {
        // Remove this connection from our map
        for (let [clientId, socket] of this.clients.entries()) {
          if (socket === ws) {
            this.clients.delete(clientId);
            console.log(`${clientId} disconnected`);
            break;
          }
        }
      });
    });
  }

  // Send update to specific user
  sendToUser(userId, data) {
    const clientId = `user_${userId}`;
    const client = this.clients.get(clientId);
    console.log(`Attempting to send to user ${clientId}, client exists:`, !!client);
    
    if (client && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
      console.log(`Message sent to user ${clientId}`);
    } else {
      console.log(`Failed to send to user ${clientId} - not connected`);
    }
  }

  // Send update to specific restaurant
  sendToRestaurant(restaurantId, data) {
    const clientId = `restaurant_${restaurantId}`;
    const client = this.clients.get(clientId);
    console.log(`Attempting to send to restaurant ${clientId}, client exists:`, !!client);
    
    if (client && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
      console.log(`Message sent to restaurant ${clientId}`);
    } else {
      console.log(`Failed to send to restaurant ${clientId} - not connected`);
    }
  }
}

module.exports = WebSocketServer;