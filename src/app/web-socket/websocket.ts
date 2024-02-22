import { WebSocketServer } from 'ws';
import { options } from './options';
import { WS_DATA_TYPE } from '../models/ws-data-type';
import { IRequest } from '../models/queries';
import { GameService } from '../services/game.service';
import { ILoginRequestData } from '../models/queries-data/player-data';
import { State } from '../state/state';
import { IAddUserToRoomData, ICreateGameData } from '../models/queries-data/room-data';
import { IAddShipsData } from '../models/queries-data/ships-data';

const gameService = new GameService();
const state = new State();


const wss: WebSocketServer = new WebSocketServer(options);
let id = 0;

wss.on('connection', function connection(ws, request) {

  let currentId = ++id;

  ws.on('error', console.error);

  ws.on('message', function message(data: Buffer) {
    const dataObject: IRequest<string> = JSON.parse(data.toString());
    console.log(currentId, '#@#', wss.clients);
    state.setCurrentUser(currentId);
    switch (dataObject?.type) {
      case WS_DATA_TYPE.REG:
        const data: ILoginRequestData = JSON.parse(dataObject.data);
        currentId = state.addUser({ name: data.name, password: data.password, index: currentId }).index;
        ws.send(gameService.getRegResponse(({ name: data.name, password: data.password, index: currentId })));
        wss.clients.forEach((ws) => {
          ws.send(gameService.getUpdateRoomResponse());
          ws.send(gameService.getUpdateWinnersResponse());
        });

        // ws.emit('message', JSON.stringify({ type: WS_DATA_TYPE.UPDATE_WINNERS, data: [], id: 0 }));
        break;
      case WS_DATA_TYPE.CREATE_ROOM:
        state.createRoom();
        wss.clients.forEach((ws) => {
          ws.send(gameService.getUpdateRoomResponse());
        });
        break;
      case WS_DATA_TYPE.ADD_USER_TO_ROOM:
        const addUserToRoomData: IAddUserToRoomData = JSON.parse(dataObject.data);
        state.addUserToRoom(addUserToRoomData);
        const createGameData: ICreateGameData = state.createGame() as ICreateGameData;
        const respData = gameService.getCreateGameResponse(createGameData) as string
        wss.clients.forEach((ws) => {
          ws.send(gameService.getUpdateRoomResponse());
          ws.send(respData);
        });
        break;
      case WS_DATA_TYPE.ADD_SHIPS:
        const addShipsData: IAddShipsData = JSON.parse(dataObject.data);


    }
  });
});

wss.on('listening', () => {
  console.log('WebSocket connected:', options);
});
