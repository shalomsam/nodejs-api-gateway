import React, { FC, useEffect, useState } from 'react';
import { AnySchema } from 'yup';

interface Props {
  type?: 'date' | 'datetime-local';
  label?: string;
  name: string;
  value?: string;
  validation?: AnySchema;
  onChange?: (newVal: string) => void;
}

const DateInput: FC<Props & React.InputHTMLAttributes<any>> = ({
  type = 'date',
  label,
  name,
  value,
  validation,
  onChange = () => null,
  onBlur = () => null
}) => {
  const [_value, setValue] = useState(value);
  const [touched, setTouched] = useState(false);
  const [validity, setvalidity] = useState(null);
  let errorMsg = null;

  if (!value) {
    const date = new Date();
    let defaultDate = date.toISOString();
    defaultDate = defaultDate.substring(0, defaultDate.length - 1);
    defaultDate = defaultDate.slice(0, 9);
    setValue(defaultDate);
  }

  if (touched && validity?.error) {
    errorMsg = (
      <span className="invalid-feedback">{validity.error.errors[0]}</span>
    );
  }

  return (
    <>
      {label && <label htmlFor={name}>{label}</label>}
      <input
        type="date"
        id={name}
        className="form-control"
        name={name}
        value={_value}
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
              isValid = validation.validateSync(value);
            } catch (e) {
              isValid = { error: e };
            }
            setvalidity(isValid);
          }
          onBlur(e);
        }}
      />
      {errorMsg}
    </>
  );
};

export default DateInput;
