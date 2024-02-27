export interface ILoginRequestData {
  name: string,
  password: string,
}

export interface ILoginResponseData extends Omit<ILoginRequestData, 'password'> {
  index: number,
  error: boolean,
  errorText: string,
}

export interface IWinner {
  name: string;
  wins: number;
}
