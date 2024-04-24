import { Token } from '../entities/token';

export const ITokenParameterStorageToken = Symbol('TokenParameterStorage');
export interface ITokenParameterStorage {
  getToken(token: string): Promise<Token | null>;
  setToken(
    token: string,
    accessStartDate: Date,
    expirationDate: Date
  ): Promise<Token>;
  getWaitingCount(): Promise<number>;
  addWaitingCount(): Promise<number>;
}
