import { IAddUserToRoomData } from '../models/queries-data/room-data';
import { IAddShipsData, IShip, IStartGameData } from '../models/queries-data/ships-data';
import { IAttackRequestData, ITurnResponseData } from '../models/queries-data/game-data';

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
  players: playerState[];
  currentPlayer: number;
}

interface playerState {
  matrix: number[][];
  idPlayer: number;
  ships: IShip[];
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


  createRoom(userId: number) {
    const user = this.getCurrentUser(userId);
    if (user) {
      this._rooms = [...this._rooms, {
        roomId: this._rooms.length + 1,
        roomUsers:
          [
            user
          ],
      }];
    }
  }

  getRoomsWithOnePlayer() {
    return this._rooms.filter((gr) => gr.roomUsers.length === 1);
  }

  getCurrentUser(id: number):Omit<userState, 'password'> {
    const user = this._users.find((u) => u.index === id) as userState;
    return { index: id, name: user.name }
  }

  addUserToRoom(data: IAddUserToRoomData, userId: number) {
    const room = this._rooms.find((r) => r.roomId === data.indexRoom) as roomState;
    const user = this.getCurrentUser(userId);
    if(room.roomUsers.length === 1) {
      room.roomUsers.push(user);
    }
  }

  createGame(data: IAddUserToRoomData, userId: number) {
    const room = this._rooms.find((r) => r.roomId === data.indexRoom) as roomState;
    const players = room?.roomUsers.map((u) => ({
      idPlayer: u.index,
      ships: [],
      matrix: [[]]
    }));
    const gameId = this._games.length + 1;
    const game = {
      gameId,
      players,
      currentPlayer: userId
    };
    this._games.push(game);
    return game;
  }

  isCurrentPlayer(gameId: number, userId: number) {
    const game = this.getGameById(gameId);
    return game?.currentPlayer === userId;
  }

  getGameById(id: number): gameState {
    return this._games.find((g) => g.gameId === id) as gameState;
  }

  addShips(data: IAddShipsData, userId: number): boolean {
    const game = this.getGameById(data.gameId);
    const player = game.players.find((p) => p.idPlayer === this._currentUser?.index) as playerState;
    if (player) {
      player.ships = data.ships;
      player.matrix = this.createMatrix(data.ships);
    }
    const playersCount = 2;
    return game.players.every((p) => p.ships.length)
  }

  getDataForStart(gameId: number, playerId: number): IStartGameData | null {
    const player = this.getGameById(gameId)?.players.find((p) => p.idPlayer === playerId);
    return player ? { ships: player.ships, currentPlayerIndex: player.idPlayer } : null;
  }

  setCurrentPlayer(gameId: number, playerId: number) {
    const game = this.getGameById(gameId) as gameState;
    game.currentPlayer = playerId;
  }

  turn(gameId: number): ITurnResponseData {
    const game = this.getGameById(gameId) as gameState;
    // const [first_player, second_player] = game.players.map((p) => p.idPlayer);
    // game.currentPlayer = game.currentPlayer === first_player ? second_player : first_player;
    return { currentPlayer: game.currentPlayer };
  }

  attack(data: IAttackRequestData) {
    const game = this.getGameById(data.gameId) as gameState;
    const matrix = this.getMatrix(game);
    return this.checkAttack(matrix, data.x, data.y);
  }

  private createMatrix(ships: IShip[]) {
    const fieldSize = 10;
    const matrix: number[][] = Array.from(Array(fieldSize), (el) => Array(fieldSize).fill(0));
    return this.addShipToMatrix(matrix, ships);
  }

  private getMatrix(game: gameState) {
    // const fieldSize = 10;
    const opponent = game.players.find((pl) => pl.idPlayer !== game.currentPlayer) as playerState;
    // const matrix: number[][] = Array.from(Array(fieldSize), (el) => Array(fieldSize).fill(0));
    // return this.addShipToMatrix(matrix, opponent.ships);
    return opponent.matrix;
  }

  private addShipToMatrix(matrix: number[][], ships: IShip[]) {
    // console.log(ships);
    this.transformShips(ships).forEach(({ x, y }) => {
      matrix[x][y] = 1;
    });
    return matrix;
  }

  private transformShips(ships: IShip[]) {
    return ships.flatMap((ship: IShip) =>
      Array.from(Array(ship.length), (el, i) => ({
          x: !ship.direction ? ship.position.x + i : ship.position.x,
          y: ship.direction ? ship.position.y + i : ship.position.y,
        })
      )
    );
  }

  private checkAttack(matrix: number[][], x: number, y: number) {
    let stX = x, stY = y, endX = x, endY = y, resArr = [], resMessage = 'miss';
    if (matrix[x][y]) {
      resMessage = 'shot';
      matrix[x][y] = 2;
      resArr.push({ x, y, res: 2 });
      while (matrix[stX - 1] && matrix[stX - 1][y]) {
        stX--;
        resArr.push({ x: stX, y, res: matrix[stX][y] });
      }
      while (matrix[endX + 1] && matrix[endX + 1][y]) {
        endX++;
        resArr.push({ x: endX, y, res: matrix[endX][y] });
      }
      while (matrix[x][stY - 1]) {
        stY--;
        resArr.push({ x, y: stY, res: matrix[x][stY] });
      }
      while (matrix[x][endY + 1]) {
        endY++;
        resArr.push({ x: stX, y, res: matrix[x][endY] });
      }
      if (resArr.every(({ res }) => res === 2)) {
        resArr = [];
        resMessage = 'kill';
        for (let x = (stX - 1) > 0 ? stX - 1 : 0; x <= (endX < 8 ? endX + 1 : 9); x++) {
          for (let y = (stY - 1) > 0 ? stY - 1 : 0; y <= (endY < 9 ? endY + 1 : 10); y++) {
            resArr.push({ x, y, res: matrix[x][y] });
          }
        }
      }
    } else {
      resArr.push({ x, y, res: 0 });
    }
    return { resArr, resMessage };
  }
}
