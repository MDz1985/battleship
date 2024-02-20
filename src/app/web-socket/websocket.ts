import { WebSocketServer } from 'ws';
import { options } from './options';
import { WS_DATA_TYPE } from '../models/ws-data-type';
import { IRequest } from '../models/queries';
import { GameService } from '../services/game.service';
import { ILoginRequestData } from '../models/queries-data/player-data';

const gameService = new GameService();


const wss: WebSocketServer = new WebSocketServer(options);

wss.on('connection', function connection(ws) {

  ws.on('error', console.error);

  ws.on('message', function message(data: Buffer) {
    const dataObject: IRequest<string> = JSON.parse(data.toString());
    switch (dataObject?.type) {
      case WS_DATA_TYPE.REG:
        const data: ILoginRequestData = JSON.parse(dataObject.data);
        ws.send(gameService.getRegResponse(({ name: data.name })));
        ws.send(gameService.getUpdateRoomResponse());
        ws.send(gameService.getUpdateWinnersResponse());

        ws.emit('message', JSON.stringify({ type: WS_DATA_TYPE.UPDATE_WINNERS, data: [], id: 0 }));
    }
  });
});

wss.on('listening', () => {
  console.log('WebSocket connected:', options);
});
