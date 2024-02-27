export interface IAddUserToRoomData {
  indexRoom: number;
}

export interface ICreateGameData {
  idGame: number,
  idPlayer: number,
}

export interface IRoomUser {
  name: string;
  index: number;
}

export interface IUpdateRoomData {
  roomId: number;
  roomUsers: IRoomUser[];
}
