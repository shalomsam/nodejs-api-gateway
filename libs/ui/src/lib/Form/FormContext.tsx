import React from 'react';
import { AnySchema } from 'yup';

type FormAnyFunction<T = any> = (name: string) => T;
type FormVoidFunction = (val: any) => void;

export type FormAnyObject<T = any> = { [name: string]: T };

export type FormState = {
  values: FormAnyObject;
  errors: FormAnyObject;
  touchedState: FormAnyObject;
};

export type FormContextValue = {
  // formState: FormState;
  getValue: FormAnyFunction;
  setValues: FormVoidFunction;
  getError: FormAnyFunction;
  setError: FormVoidFunction;
  getTouched: (name: string) => boolean;
  setTouched: FormVoidFunction;
  validate: (value: any, fieldName: string) => void;
};

const FormContext = React.createContext<FormContextValue>(null);

export default FormContext;
