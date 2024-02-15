import { WebSocketServer } from 'ws';
import { options } from './options';
import { WsDataType } from '../models/ws-data-type';


const wss: WebSocketServer = new WebSocketServer(options);

wss.on('connection', function connection(ws) {

  ws.on('error', console.error);

  ws.on('message', function message(data: string) {
    const dataObject = JSON.parse(data);
    console.log('received: ', dataObject);
    ws.send(JSON.stringify(JSON.parse(data)));
    if(dataObject.type === WsDataType.REG) {
      ws.emit('message', JSON.stringify({type: WsDataType.UPDATE_ROOM, data: [], id:0}))
      ws.emit('message', JSON.stringify({type: WsDataType.UPDATE_WINNERS, data: [], id:0}))
    }
  });

  ws.send('something');
});

wss.on('listening', () => {
  console.log('WebSocket connected:', options);
});
