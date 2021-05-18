export interface Client {
  _id?: string;
  name: string;
  algoName: string;
  secret: string;
  apiPublicKey: string;
  basePath: string;
  clientEndpoint: string;
  dailyLimit: number;
  hitCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}
