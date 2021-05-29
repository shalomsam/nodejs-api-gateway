import React, { FC, useState } from 'react';
import { AnySchema } from 'yup';
import FormContext, { FormAnyObject, FormState } from './FormContext';

export type FormProps = {
  initialValues?: FormAnyObject;
  validations?: {
    [name: string]: AnySchema;
  };
  submit: (
    data: FormAnyObject,
    errors: FormAnyObject,
    e: React.FormEvent
  ) => void;
};

export const Form: FC<FormProps> = ({
  initialValues,
  validations,
  submit,
  children,
}) => {

  const [values, _setValues] = useState<FormAnyObject>(initialValues);
  const [errors, _setError] = useState<FormAnyObject>({});
  const [touchedState, _setTouched] = useState<FormAnyObject<boolean>>({});

  const formState: FormState = {
    values,
    errors,
    touchedState,
  };

  const validate = (value, fieldName) => {
    const validator = validations?.[fieldName];
    try {
      const isValid = validator?.validateSync(value);
      if (isValid) {
        _setError({
          ...errors,
          [fieldName]: undefined,
        });
      }
    } catch (e) {
      _setError({
        ...errors,
        [fieldName]: e.message,
      });
    }
  }

  const getValue = (name: string) => values?.[name] || '';
  const getError = (name: string) => errors?.[name] || undefined;
  const getTouched = (name: string) => touchedState?.[name] || false;
  const setValues = (value: FormAnyObject) => _setValues({ ...values, ...value });
  const setError = (value: FormAnyObject) => _setError({ ...errors, ...value });
  const setTouched = (value: Record<string, boolean>) =>
    _setTouched({ ...touchedState, ...value });

  return (
    <FormContext.Provider
      value={{
        getValue,
        getError,
        getTouched,
        setValues,
        setError,
        setTouched,
        validate,
      }}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(values, errors, e);
        }}
      >
        {children}
      </form>
    </FormContext.Provider>
  );
};


// export const Form: FC<FormProps> = ({ initialValue, validations, children, submit }) => {

//   const formInitialState = {
//     errors: {},
//   };

//   const [formState, setFormState] = useState(formInitialState);

//   const register = (childProps: React.InputHTMLAttributes<any>) => {

//     const orgOnBlur = childProps.onBlur;
//     const { name, value } = childProps;

//     return {
//       value: initialValue?.[name] || value,
//       onBlur: (e) => {
//         const val = e.target.value;
//         let valid;
//         try {
//           valid = validations[name].validateSync(val);
//           delete formState.errors?.[name];
//         } catch (e) {
//           formState.errors = {
//             ...formState.errors,
//             [name]: e.message
//           };
//         }

//         console.log(`form: ${name}: `, formState.errors[name]);

//         setFormState(formState);

//         if (typeof orgOnBlur === 'function') orgOnBlur(e);
//       }
//     };
//   }

//   return (
//     <form
//       onSubmit={(e) => {
//         e.preventDefault();
//         const el = e.target;
//         const formData = new FormData(e.target as any);
//         const object = {};
//         formData.forEach((value, key) => {
//           object[key] = value;
//         });

//         if (Object.keys(formState.errors).length) {
//           submit(object, el, e, formData);
//         }
        
//       }}
//     >
//       {React.Children.map(children, (child) => {
//         if (!React.isValidElement(child)) {
//           return child;
//         }

//         return child.props.name
//           ? React.createElement(child.type, {
//               ...{
//                 ...child.props,
//                 key: child.props.name,
//                 ...register(child.props),
//                 error: formState.errors?.[child.props.name] || null,
//               },
//             })
//           : child;
//       })}
//     </form>
//   );
// };