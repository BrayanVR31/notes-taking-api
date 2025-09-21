export class PayloadFull {
  sub: number;
  email: string;
  iat: number;
  exp: number;
}

export interface Payload {
  sub: number;
  username: string;
}
