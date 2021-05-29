import React, { FC, useContext, useMemo } from 'react';
import FormContext, { FormContextValue } from './FormContext';

export interface FieldProps {
  type?: 'text' | 'number' | 'password' | 'checkbox' | 'radio';
  label?: string;
  name: string;
  placeholder?: string;
}

export const Field: FC<FieldProps> = ({
  type = 'text',
  label,
  name,
  placeholder,
}) => {
  let errorMsg = null;
  let statusClass = 'form-control';

  const {
    getError,
    getTouched,
    getValue,
    setTouched,
    setValues,
    validate,
  } = useContext<FormContextValue>(FormContext);

  const value = useMemo(() => getValue(name), [name, getValue]);
  const error = useMemo(() => getError(name), [name, getError]);
  const touched = useMemo(() => getTouched(name), [name, getTouched]);

  if (touched && error) {
    errorMsg = <span className="invalid-feedback d-block">{error}</span>;
    statusClass += ' is-invalid';
  }

  // TODO: support checkbox & radio

  return (
    <div className="form-group">
      {label && <label htmlFor={name}>{label}</label>}
      <input
        type={type}
        id={name}
        className={statusClass}
        name={name}
        value={value}
        onChange={(e) => {
          const val = e.target.value;
          !touched &&
            setTouched({
              [name]: true,
            });
          setValues({
            [name]: val,
          });
        }}
        placeholder={placeholder || label}
        onBlur={(e) => {
          const val = e.target.value;
          validate(val, name);
        }}
      />
      {errorMsg}
    </div>
  );
};
