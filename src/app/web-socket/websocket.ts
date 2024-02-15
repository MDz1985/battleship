import { WebSocketServer } from 'ws';
import { options } from './options';


const wss: WebSocketServer = new WebSocketServer(options);

wss.on('connection', function connection(ws) {

  ws.on('error', console.error);

  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });

  ws.send('something');
});

wss.on('listening', () => {
  console.log('WebSocket connected:', options);
})
