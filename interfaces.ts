export interface IProduct {
  productId: string;
  name: string;
  price: number;
  deleted?: boolean;
}

export interface IAuthHeader {
  Issuer: string;
  Role: string;
  exp: string;
}
