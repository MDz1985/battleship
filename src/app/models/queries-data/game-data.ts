import { IPosition } from './ships-data';

export interface IAttackRequestData extends IPosition, IRandomAttackRequestData {}

export interface IRandomAttackRequestData {
  gameId: number;
  indexPlayer: number;
}

export interface IAttackResponseData {
  position: IPosition;
  currentPlayer: number;
  status: ATTACK_STATUS;
}

export interface ITurnResponseData {
  currentPlayer: number;
}

export interface IFinishGameResponseData {
  winPlayer: number;
}

export enum ATTACK_STATUS {
  MISS = 'miss',
  KILLED = 'killed',
  SHOT = 'shot',
}

