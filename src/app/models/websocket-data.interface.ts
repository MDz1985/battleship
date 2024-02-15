import { WsDataType } from './ws-data-type';

export interface IWebsocketData {
  type: WsDataType;
  data:
    {
      name: string;
      index: number;
      error: boolean;
      errorText: string;
    };
  id: 0;
}
