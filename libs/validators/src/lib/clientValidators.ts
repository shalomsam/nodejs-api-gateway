import { object, string, number } from 'yup';

export const newClientValidator = object({
  name: string().required(),
  basePath: string()
    .required()
    .transform((value) => `/${value.trim().replace(/\//g, '')}`),
  clientEndpoint: string().url(),
  dailyLimit: number().required(),
});
