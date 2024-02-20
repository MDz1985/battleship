interface userState {
  name: string;
  index: number;
  password: string;
}

interface roomState {
  roomId: number,
  roomUsers: Omit<userState, 'password'>[]
}

export class State {
  static instance: State;
  private _users: userState[] = [];
  private _currentUser?: Omit<userState, 'password'>;
  private _rooms: roomState[] = [];

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
}
