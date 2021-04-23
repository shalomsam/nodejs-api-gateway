export interface Setting {
  jwtTtl: number;
  algoName: string;
  apiKeyHandle: string;
  jwtTokenHandle: string;
  cookieDomain: string;
  passwordMinLength: number;
  passwordMaxLength: number;
  cacheTtl: number;
}
