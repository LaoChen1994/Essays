export type Strings = string[];
export type Numbers = number[];

export type combine = [...Strings, ...Numbers];

export interface IUserInfo {
  name: string;
  age: number;
  hobby?: string;
}

export interface IGoods {
  goodName: string;
  price: number;
}
