// const WebSocket = require('ws');

// const wss = new WebSocket.Server({ port: 8080 });

// wss.on('connection', function connection(ws) {
//   console.log('Client connected');

//   ws.onmessage = (event) => {
//     wss.clients.forEach((client) => {
//       if (client !== ws && client.readyState === WebSocket.OPEN) {
//         client.send(event.data);
//       }
//     });
//     console.log('Received message:', event.data);
//   };
    
//   ws.onerror = (error) => {
//     console.error('WebSocket error:', error);
//   };
    
//   ws.close = () => {
//     console.log('Client disconnected');
//   };
// });

// console.log('WebSocket server listening on port 8080');

const WebSocket = require('ws');
const url = require('url');

const wss = new WebSocket.Server({ port: 8080 });

const clients = new Map();

wss.on('connection', function connection(ws,req) {
  console.log('clients', clients);

  const userId = url.parse(req.url, true).query.userId;
  
  addClient("user"+userId,userId);
  console.log('clients', clients);

  ws.on('message', function incoming(message) {
    console.log('Received: %s', message);
    
    const { userId, data } = JSON.parse(message);
    
    const userSocket = clients.has("user"+userId);

    if (userSocket) {
      sendSocket(data);
    } else {
      console.log(`User ${userId} not found`);
    }
  });

  ws.on('close', function close() {
    console.log('Client disconnected');
    
    removeClient(ws);
  });

  function sendSocket(data){
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  }
  
  function addClient(userId, socket) {
    clients.set(userId, socket);
  }
  
  function removeClient(socket) {
    clients.forEach((value, key) => {
      if (value === socket) {
        clients.delete(key);
      }
    });
  }
});

console.log('WebSocket server listening on port 8080');
