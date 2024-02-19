export interface IAddShipsData {
  gameId: number;
  ships: IShip[];
  indexPlayer: number;
}

export interface IStartGameData {
  ships: IShip[];
  currentPlayerIndex: number;
}

export interface IShip {
  position: IPosition,
  direction: boolean;
  length: number;
  type: SHIP_TYPE;
}

export interface IPosition {
  x: number;
  y: number;
}

export enum SHIP_TYPE {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
  HUGE = 'huge',
}
