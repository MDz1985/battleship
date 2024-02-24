import { IAddUserToRoomData } from '../models/queries-data/room-data';
import { IAddShipsData, IShip, IStartGameData } from '../models/queries-data/ships-data';
import { ITurnResponseData } from '../models/queries-data/game-data';

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
  currentPlayer: number
}

export class State {
  static instance: State;
  private _users: userState[] = [];
  private _currentUser?: Omit<userState, 'password'>;
  private _rooms: roomState[] = [];
  private _games: gameState[] = [];

  constructor() {return State.instance ?? (State.instance = this);}

  setCurrentUser(id: number) {
    this._currentUser = this._users.find((user) => user.index === id) ?? { index: id, name: '' };
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
      const gameId = this._games.length + 1;
      this._games.push({
        gameId,
        players: [
          {
            idPlayer: this._currentUser.index,
            ships: []
          }
        ],
        currentPlayer: this._currentUser.index
      });
      return { idGame: gameId, idPlayer: this._currentUser.index };
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

  addShips(data: IAddShipsData): IStartGameData | null {
    const game = this._games.find((game) => game.gameId === data.gameId) as gameState;
    const player = game.players.find((p) => p.idPlayer === this._currentUser?.index);
    if (player) {
      player.ships = data.ships;
    } else if (this._currentUser?.index) {
      game.players.push({
        idPlayer: this._currentUser.index,
        ships: data.ships
      });
    }
    const playersCount = 2;
    return (game?.players?.length < playersCount) || !game.players.every((p) => p.ships.length) || !this._currentUser?.index
      ? null
      : { ships: data.ships, currentPlayerIndex: this._currentUser.index };
  }

  turn(gameId: number): ITurnResponseData {
   const game = this.getGameById(gameId) as gameState;
   const [first_player, second_player] = game.players.map((p)=>p.idPlayer);
   game.currentPlayer = game.currentPlayer === first_player ? second_player : first_player
   return { currentPlayer: game.currentPlayer }
  }
}
