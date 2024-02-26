import { WebSocket, WebSocketServer } from 'ws';
import { options } from './options';
import { WS_DATA_TYPE } from '../models/ws-data-type';
import { AttackResponse, IRequest } from '../models/queries';
import { GameService } from '../services/game.service';
import { ILoginRequestData } from '../models/queries-data/player-data';
import { State } from '../state/state';
import { IAddUserToRoomData, ICreateGameData } from '../models/queries-data/room-data';
import { IAddShipsData } from '../models/queries-data/ships-data';
import { ATTACK_STATUS, IAttackRequestData, IAttackResponseData, ITurnResponseData } from '../models/queries-data/game-data';

const gameService = new GameService();
const state = new State();


const wss: WebSocketServer = new WebSocketServer(options);
let id = 0;

interface CustomWebSocket extends WebSocket {
  playerId?: number;
}

wss.on('connection', function connection(ws: CustomWebSocket, request) {

  let currentId: number = ++id;
  ws.playerId = currentId;

  ws.on('error', console.error);

  ws.on('message', function message(data: Buffer) {


    const dataObject: IRequest<string> = JSON.parse(data.toString());
    state.setCurrentUser(currentId);
    switch (dataObject?.type) {
      case WS_DATA_TYPE.REG:
        const data: ILoginRequestData = JSON.parse(dataObject.data);
        state.addUser({ name: data.name, password: data.password, index: currentId }).index;
        ws.send(gameService.getRegResponse(({ name: data.name, password: data.password, index: currentId })));
        wss.clients.forEach((ws) => {
          ws.send(gameService.getUpdateRoomResponse());
          ws.send(gameService.getUpdateWinnersResponse());
        });

        break;
      case WS_DATA_TYPE.CREATE_ROOM:
        state.createRoom(currentId);
        wss.clients.forEach((ws) => {
          ws.send(gameService.getUpdateRoomResponse());
        });
        break;
      case WS_DATA_TYPE.ADD_USER_TO_ROOM:
        const addUserToRoomData: IAddUserToRoomData = JSON.parse(dataObject.data);
        state.addUserToRoom(addUserToRoomData, currentId);
        const game = state.createGame(addUserToRoomData, currentId);


        // const respData = gameService.getCreateGameResponse(createGameData) as string;


        wss.clients.forEach((ws: CustomWebSocket) => {
          ws.send(gameService.getUpdateRoomResponse());
          // const game = state.getGameById()

          if (ws.playerId && game && game.players.some((p) => p.idPlayer === ws.playerId)) {
            const createGameData = {
              idGame: game.gameId,
              idPlayer: ws.playerId
            };
            const respData = gameService.getCreateGameResponse(createGameData) as string;
            ws.send(respData);
          }
        });
        break;
      case WS_DATA_TYPE.ADD_SHIPS:
        const addShipsData: IAddShipsData = JSON.parse(dataObject.data);


        state.setCurrentPlayer(addShipsData.gameId, addShipsData.indexPlayer);
        // state.addShips(addShipsData)



        // if (dataForStart) {
        if(state.addShips(addShipsData, currentId)) {
          wss.clients.forEach((ws: CustomWebSocket) => {
            const game = state.getGameById(addShipsData.gameId);
            if(ws.playerId && game.players.some((pl) => pl.idPlayer === ws.playerId)) {
              const dataForStart = state.getDataForStart(addShipsData.gameId, ws.playerId);
              if(dataForStart) {
                ws.send(gameService.getStartGameResponse(dataForStart));
              }
            }



            // const turnResponseData: ITurnResponseData = state.turn(addShipsData.gameId);

          });
        }

        // }
        break;
      case WS_DATA_TYPE.ATTACK:
        const attackData: IAttackRequestData = JSON.parse(dataObject.data);
        if(!state.isCurrentPlayer(attackData.gameId, attackData.indexPlayer)) break;
        state.setCurrentPlayer(attackData.gameId, attackData.indexPlayer);
        const attackRespData = state.attack(attackData);
        let attackResponseData: IAttackResponseData;
        wss.clients.forEach((ws: CustomWebSocket) => {

          console.log(ws.playerId, '@userID');


          attackRespData.resArr.forEach(({ x, y, res }) => {
            switch (res) {
              case 0:
                attackResponseData = { position: { x, y }, currentPlayer: attackData.indexPlayer, status: ATTACK_STATUS.MISS };
                break;
              case 2:
                attackResponseData = { position: { x, y }, currentPlayer: attackData.indexPlayer, status: ATTACK_STATUS.SHOT };
                if (attackRespData.resMessage === 'kill') attackResponseData.status = ATTACK_STATUS.KILLED;
                break;
              default:
                break;
            }
            ws.send(gameService.getAttackResponse(attackResponseData));
          });
          const turnResponseData: ITurnResponseData = state.turn(attackData.gameId);
          ws.send(gameService.getTurnResponse(turnResponseData));
        });
        break;
      case WS_DATA_TYPE.RANDOM_ATTACK:
        const randomAttackData: IAttackRequestData = JSON.parse(dataObject.data);
        const turnResponseData: ITurnResponseData = state.turn(randomAttackData.gameId);
        wss.clients.forEach((ws: CustomWebSocket) => {


          if (ws.playerId) {
            turnResponseData.currentPlayer = ws.playerId;
          }


          ws.send(gameService.getTurnResponse(turnResponseData));
        });
    }
  });
});

wss.on('listening', () => {
  console.log('WebSocket connected:', options);
});
