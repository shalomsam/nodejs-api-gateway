import { object, string } from 'yup';
import { Roles } from '@node-api-gateway/api-interfaces';
import { globalConfig } from '@node-api-gateway/config';

const { passwordMaxLength, passwordMinLength } = globalConfig;

export const newUserValidator = object({
  email: string().email().required(),
  password: string().min(passwordMinLength).max(passwordMaxLength).required(),
  firstName: string().min(3).required(),
  lastName: string().min(3).required(),
  role: string().oneOf([Roles.Admin, Roles.User]).optional(),
}); 

export const loginValidator = object({
  email: string().email().required(),
  password: string().min(passwordMinLength).max(passwordMaxLength).required()
});


export const resetPassValidator = object({
  email: string().email().required(),
});

export const updateUserValidator = object({
  password: string().min(passwordMinLength).max(passwordMaxLength).optional(),
  // TODO: should these min values be in config?
  firstName: string().min(3).optional(),
  lastName: string().min(3).optional(),
  role: string().oneOf([Roles.Admin, Roles.User]).optional(),
  resetToken: string().optional(),
});

