import { ILoginResponseData, IWinner } from '../models/queries-data/player-data';
import { LoginResponse, UpdateRoomResponse, UpdateWinnersResponse } from '../models/queries';
import { WS_DATA_TYPE } from '../models/ws-data-type';
import { IUpdateRoomData } from '../models/queries-data/room-data';

export class GameService {
  static instance: GameService;

  constructor() {
    return GameService.instance ?? (GameService.instance = this);
  }

  getRegResponse({ name = '', errorText = '' }: { name?: string, errorText?: string }) {
    const data: ILoginResponseData = { error: !!errorText, errorText, index: 1, name };
    return new LoginResponse(data, WS_DATA_TYPE.REG).response;
  }

  getUpdateRoomResponse() {
    return new UpdateRoomResponse('', WS_DATA_TYPE.UPDATE_ROOM).response;
  }

  getUpdateWinnersResponse() {
    const data: IWinner[] = []
    return new UpdateWinnersResponse(data, WS_DATA_TYPE.UPDATE_WINNERS).response;
  }
}
