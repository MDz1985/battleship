import { WS_DATA_TYPE } from './ws-data-type';
import { IWinner } from './queries-data/player-data';
import { ILoginRequestData, ILoginResponseData } from './queries-data/player-data';
import { IAddUserToRoomData, ICreateGameData } from './queries-data/room-data';
import { IAddShipsData } from './queries-data/ships-data';
import {
  IAttackRequestData,
  IAttackResponseData,
  IFinishGameResponseData,
  IRandomAttackRequestData,
  ITurnResponseData
} from './queries-data/game-data';

export interface IRequest<T> {
  type: WS_DATA_TYPE;
  data: T;
  id: 0;
}


class Query<T> {
  type: WS_DATA_TYPE;
  data: T;
  id = 0;

  constructor(data: T, type: WS_DATA_TYPE) {
    this.data = data;
    this.type = type;
  }
}

// Player
export class LoginRequest extends Query<ILoginRequestData> {}

export class LoginResponse extends Query<ILoginResponseData> {}

export class UpdateWinnersResponse extends Query<IWinner[]> {}

// Room
export class CreateNewRoomRequest extends Query<string> {}

export class AddUserToRoomRequest extends Query<IAddUserToRoomData> {}

export class CreateGameResponse extends Query<ICreateGameData> {}

export class UpdateRoomResponse extends Query<ICreateGameData> {}

// Ships
export class AddShipsToTheGameBoardRequest extends Query<IAddShipsData> {}

export class StartGameResponse extends Query<ICreateGameData> {}

// Game

export class AttackRequest extends Query<IAttackRequestData> {}

export class RandomAttackRequest extends Query<IRandomAttackRequestData> {}

export class AttackResponse extends Query<IAttackResponseData> {}

export class TurnResponse extends Query<ITurnResponseData> {}

export class FinishResponse extends Query<IFinishGameResponseData> {}
