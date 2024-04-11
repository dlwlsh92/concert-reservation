import { Token } from "../token";

export const ITokenParameterStorageToken = Symbol("TokenParameterStorage");
export interface ITokenParameterStorage {
  getToken(token: string): Promise<Token>;
  setToken(token: string): Promise<Token>;
  getWaitingCount(): Promise<number>;
  addWaitingCount(): Promise<number>;
}
