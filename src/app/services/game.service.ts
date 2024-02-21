import { ILoginResponseData, IWinner } from '../models/queries-data/player-data';
import { CreateGameResponse, LoginResponse, UpdateRoomResponse, UpdateWinnersResponse } from '../models/queries';
import { WS_DATA_TYPE } from '../models/ws-data-type';
import { State } from '../state/state';

export class GameService {
  static instance: GameService;
  private readonly _state: State = new State();

  constructor() {
    return GameService.instance ?? (GameService.instance = this);
  }

  getRegResponse({ name = '', password = '', errorText = '' }: { name?: string, password?: string, errorText?: string }) {
    const index = this._state.addUser({name, password}).index;
    console.log(this._state.getAllUsers());
    const data: ILoginResponseData = { error: !!errorText, errorText, index, name };
    return new LoginResponse(data, WS_DATA_TYPE.REG).response;
  }

  getUpdateRoomResponse() {
    const rooms = this._state.getRoomsWithOnePlayer();
    return new UpdateRoomResponse(rooms, WS_DATA_TYPE.UPDATE_ROOM).response;
  }

  getUpdateWinnersResponse() {
    const data: IWinner[] = []
    return new UpdateWinnersResponse(data, WS_DATA_TYPE.UPDATE_WINNERS).response;
  }

  getCreateGameResponse() {
    const data = this._state.getGameBy();
    return new CreateGameResponse(data, WS_DATA_TYPE.CREATE_GAME).response
  }
}

