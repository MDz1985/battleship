import { IAddUserToRoomData } from '../models/queries-data/room-data';
import { IAddShipsData, IShip } from '../models/queries-data/ships-data';

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
  gameId: number;
  players: [
    {
      idPlayer: number;
      ships: IShip[];
    }
  ];
}

export class State {
  static instance: State;
  private _users: userState[] = [];
  private _currentUser?: Omit<userState, 'password'>;
  private _rooms: roomState[] = [];
  private _games: gameState[] = [];

  constructor() {return State.instance ?? (State.instance = this);}

  setCurrentUser(id: number) {
    this._currentUser = this._users.find((user) => user.index === id) ?? {index: id, name: ''};
  }

  addUser(user: userState): userState {
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
      const gameId =this._games.length + 1
      this._games.push({
        gameId,
        players: [
          {
            idPlayer: this._currentUser.index,
            ships: []
          }
        ]
      });
      return {idGame: gameId, idPlayer: this._currentUser.index}
    }
  }

  // createGame({ gameId, ships, indexPlayer }: IAddShipsData) {
  //   const game = this._games.find((game) => game.gameId === gameId);
  //   if (game) {
  //     game.players.push({
  //       idPlayer: indexPlayer,
  //       ships: ships
  //     });
  //   } else {
  //     this._games.push({
  //       gameId: this._games.length + 1,
  //       players: [{
  //         idPlayer: indexPlayer,
  //         ships: ships
  //       }]
  //     });
  //   }
  // }

  getGameById(id: number): gameState | undefined {
    return this._games.find((g) => g.gameId === id);
  }
}
