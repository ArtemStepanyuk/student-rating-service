const webSocketServer = require('websocket').server;
const http = require('http');

const authorizedConnections = {};

const listener = (req, res) => {
  res.writeHead(200);
  return res.end('WS is running');
};

const server = http.createServer(listener);
const WS_PORT = 8081;
server.listen(WS_PORT, () => {
  console.log(`WS server listening on port ${WS_PORT}`);
});

const wsServer = new webSocketServer({ httpServer: server });

function broadcastUserList() {
  const users = Object.entries(authorizedConnections).map(([id, obj]) => ({
    userId: id,
    role: obj.role
  }));
  const msg = JSON.stringify({ type: 'user_list', users });
  Object.values(authorizedConnections).forEach(({ connection }) => {
    connection.sendUTF(msg);
  });
}

wsServer.on('request', request => {
  const connection = request.accept(null, request.origin);
  let registeredId = null;

  connection.on('message', raw => {
    let data;
    try {
      data = JSON.parse(raw.utf8Data);
    } catch (e) {
      return;
    }

    if (data.type === 'register') {
      const { userId, role } = data;
      if (!authorizedConnections[userId]) {
        registeredId = userId;
        authorizedConnections[userId] = { connection, role };
        console.log(`User ${userId} connected as ${role}`);
        broadcastUserList();
      }
      connection.on('close', () => {
        if (registeredId && authorizedConnections[registeredId]) {
          delete authorizedConnections[registeredId];
          console.log(`User ${registeredId} disconnected`);
          broadcastUserList();
        }
      });
    } else if (data.type === 'get_users') {
      broadcastUserList();
    } else if (data.type === 'message') {
      const { to, text, from } = data.payload;
      if (to in authorizedConnections) {
        const outgoing = {
          type: 'message',
          payload: { from, text, timestamp: Date.now() }
        };
        authorizedConnections[to].connection.sendUTF(JSON.stringify(outgoing));
      } else {
        const errMsg = JSON.stringify({
          type: 'error',
          text: `User ${to} is not online`
        });
        connection.sendUTF(errMsg);
      }
    }
  });
});
