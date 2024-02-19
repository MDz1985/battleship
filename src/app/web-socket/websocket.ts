import { WebSocketServer } from 'ws';
import { options } from './options';
import { WS_DATA_TYPE } from '../models/ws-data-type';
import { IRequest } from '../models/queries';


const wss: WebSocketServer = new WebSocketServer(options);

wss.on('connection', function connection(ws) {

  ws.on('error', console.error);

  ws.on('message', function message(data: string) {
    const dataObject: IRequest<unknown> = JSON.parse(data);
    switch (dataObject?.type) {
      case WS_DATA_TYPE.REG:
        ws.send(JSON.stringify(JSON.parse(data)));
    }

    if(dataObject.type === WS_DATA_TYPE.REG) {
      ws.emit('message', JSON.stringify({type: WS_DATA_TYPE.UPDATE_ROOM, data: [], id:0}))
      ws.emit('message', JSON.stringify({type: WS_DATA_TYPE.UPDATE_WINNERS, data: [], id:0}))
    }
  });

  ws.send('something');
});

wss.on('listening', () => {
  console.log('WebSocket connected:', options);
});
