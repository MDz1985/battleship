import { ILoginResponseData, IWinner } from '../models/queries-data/player-data';
import {
  AttackResponse,
  CreateGameResponse,
  FinishResponse,
  LoginResponse,
  StartGameResponse,
  TurnResponse,
  UpdateRoomResponse,
  UpdateWinnersResponse
} from '../models/queries';
import { WS_DATA_TYPE } from '../models/ws-data-type';
import { State } from '../state/state';
import { ICreateGameData } from '../models/queries-data/room-data';
import { IStartGameData } from '../models/queries-data/ships-data';
import { IAttackResponseData, IFinishGameResponseData, ITurnResponseData } from '../models/queries-data/game-data';

export class GameService {
  static instance: GameService;
  private readonly _state: State = new State();

  constructor() {
    return GameService.instance ?? (GameService.instance = this);
  }

  getRegResponse({ name = '', password = '', errorText = '', index = 0 }: { name?: string, password?: string, errorText?: string, index?: number }) {
    const data: ILoginResponseData = { error: !!errorText, errorText, index, name };
    return new LoginResponse(data, WS_DATA_TYPE.REG).response;
  }

  getUpdateRoomResponse() {
    const rooms = this._state.getRoomsWithOnePlayer();
    return new UpdateRoomResponse(rooms, WS_DATA_TYPE.UPDATE_ROOM).response;
  }

  getUpdateWinnersResponse() {
    const data: IWinner[] = [];
    return new UpdateWinnersResponse(data, WS_DATA_TYPE.UPDATE_WINNERS).response;
  }

  getCreateGameResponse(data: ICreateGameData) {
    return data ? new CreateGameResponse(data, WS_DATA_TYPE.CREATE_GAME).response : null;
  }

  getStartGameResponse(data: IStartGameData) {
    return new StartGameResponse(data, WS_DATA_TYPE.START_GAME).response;
  }

  getTurnResponse(data: ITurnResponseData) {
    return new TurnResponse(data, WS_DATA_TYPE.TURN).response
  }

  getAttackResponse(data: IAttackResponseData) {
    return new AttackResponse(data, WS_DATA_TYPE.ATTACK).response
  }

  getFinishResponse(data: IFinishGameResponseData) {
    return new FinishResponse(data, WS_DATA_TYPE.FINISH).response
  }
}

