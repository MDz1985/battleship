import { IAddUserToRoomData } from '../models/queries-data/room-data';

interface userState {
  name: string;
  index: number;
  password: string;
}

interface roomState {
  roomId: number,
  roomUsers: Omit<userState, 'password'>[]
}

interface gameState {
  idGame: number;
  idPlayer: number;
}

export class State {
  static instance: State;
  private _users: userState[] = [];
  private _currentUser?: Omit<userState, 'password'>;
  private _rooms: roomState[] = [];
  private _games: gameState[] = [];

  constructor() {return State.instance ?? (State.instance = this);}

  addUser(user: Omit<userState, 'index'>): userState {
    let resultUser = this._users.find((us) => user.password === us.password && user.name === us.name);
    if (!resultUser) {
      resultUser = { ...user, index: this._users.length + 1 };
      this._users = [...this._users, resultUser];
    }
    this._currentUser = { name: resultUser.name, index: resultUser.index };
    return resultUser;
  }

  getUser({ name, password }: { name: string, password: string }) {
    return this._users.find((user) => user.password === password && user.name === name);
  }

  getAllUsers() {
    return this._users;
  }


  createRoom() {
    if (this._currentUser) {
      this._rooms = [...this._rooms, {
        roomId: this._rooms.length + 1,
        roomUsers:
          [
            this._currentUser
          ],
      }];
    }
  }

  getRoomsWithOnePlayer() {
    return this._rooms.filter((gr) => gr.roomUsers.length === 1);
  }

  addUserToRoom(data: IAddUserToRoomData) {
    this._rooms = this._rooms.map((room) => {
      if (room.roomId === data.indexRoom && room.roomUsers.length === 1 && room.roomUsers[0].index !== this._currentUser?.index && this._currentUser) {
        room.roomUsers.push(this._currentUser);
      }
      return room;
    });
  }

  createGame() {
    if (this._currentUser?.index) {
      this._games.push({
        idGame: this._games.length + 1,
        idPlayer: this._currentUser.index
      });
    }
  }

  getGameBy(): gameState {
    return this._games.find((g)=> g.idPlayer === this._currentUser?.index) as gameState
  }
}
