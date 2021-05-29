import React, { FC, useEffect, useState } from 'react';
import { AnySchema } from 'yup';

export interface IOptions {
  label: string;
  value: string;
  isSelected?: boolean;
}

interface Props {
  label: string;
  name: string;
  options: IOptions[];
  _default?: string | number; // `default` is reserved word in Javascript
  validation?: AnySchema;
}

const Select: FC<Props & React.InputHTMLAttributes<any>> = ({
  label,
  name,
  options,
  _default,
  onChange = (e) => null,
  onBlur = (e) => null,
  validation,
}) => {
  const defaultValue: string | number = _default || options[0].value;
  const [value, setValue] = useState(defaultValue);
  const [touched, setTouched] = useState(false);
  const [validity, setvalidity] = useState(null);
  let errorMsg = null;

  if (touched && validity?.error) {
    errorMsg = (
      <span className="invalid-feedback">{validity.error.errors[0]}</span>
    );
  }

  const htmlOptions = options.map(({ label, value }) => {
    return (
      <option key={`${name}-${value}`} value={value}>
        {label}
      </option>
    );
  });

  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <select
        id={name}
        name={name}
        className="form-control"
        value={value}
        onChange={(e) => {
          const val = e.target.value;
          !touched && setTouched(true);
          setValue(val);
          onChange(e);
        }}
        onBlur={async (e) => {
          let isValid;
          if (validation) {
            try {
              isValid = await validation.validateSync(value);
            } catch (e) {
              isValid = { error: e };
            }
            setvalidity(isValid);
          }
          onBlur(e);
        }}
      >
        {htmlOptions}
      </select>
      {errorMsg}
    </div>
  );
};

export default Select;
