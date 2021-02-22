import React, { FC, useState } from 'react';

interface IOptions {
    label: string;
    value: string;
    isSelected?: boolean;
}

interface InputStatus {
    status: 'error' | 'success';
    message: string;
}

type Validation = (value: string) => InputStatus;

interface FieldProps {
    label: string;
    name: string;
    type?: 'text' | 'password' | 'select' | 'multi-select' | 'date' | 'datetime-local' | 'checkbox' | 'radio';
    options?: IOptions[];
    value?: string | string[];
    placeholder?: string;
    setDefaultDate?: boolean;
    required?: boolean;
    validations?: Validation[];
}

const Field: FC<FieldProps> = ({
    type,
    label,
    name,
    placeholder,
    options,
    validations,
    value = '',
    setDefaultDate = false,
    required = false,
}) => {
    // let { addFormData } = useContext<FormContextType>(FormContext as any);
    let defaultValue = value;
    if (options && options.length) {
        defaultValue = String(options[0].value);
        if (type === 'multi-select') {
            defaultValue = [defaultValue];
        }
    }

    const [ _value, setValue ] = useState(defaultValue);
    const [ inputMsgs, setInputMsgs ] = useState([] as InputStatus[]);

    const onChange = (newValue: any) => {
        setValue(newValue);
    }

    const onBlur = (newVal: string) => {
        if (required && !newVal) {
            setInputMsgs([...inputMsgs, { status: 'error', message: `Please provide a valid value for ${label}` }]);
        } else if (validations?.length) {
            // eslint-disable-next-line array-callback-return
            validations.map((validation) => {
                const isValid = validation(newVal);
                if (typeof isValid === 'string') {
                    setInputMsgs([...inputMsgs, isValid])
                }
            });
        }
    }

    const lastMsg: InputStatus | undefined = inputMsgs[inputMsgs.length - 1] || undefined;

    const getStatusClass = (iStatus: InputStatus) => {
        if (iStatus.status === 'error') {
            return 'invalid-feedback';
        } else if (iStatus.status === 'success') {
            return 'valid-feedback';
        } else {
            return '';
        }
    };

    let inputMsgEl = lastMsg ? 
        (<small
            className={getStatusClass(lastMsg)}
        >
            {lastMsg.message}
        </small>) : null;

    let fieldContent = null;

    if (type === 'text' || type === 'password' || type === 'date' || type === 'datetime-local') {
        if ((type === 'date' || type === 'datetime-local') && setDefaultDate && _value === '') {
            const date = new Date();
            let defaultDate = date.toISOString();
            defaultDate = defaultDate.substring(0, defaultDate.length - 1);
            if (type === 'date') {
                defaultDate = defaultDate.slice(0,9);
            }
            setValue(defaultDate);
        }

        fieldContent = (
            <>
                {label && <label htmlFor={name}>{label}</label>}
                <input
                    type={type}
                    id={name}
                    className='form-control'
                    name={name}
                    value={_value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder || label}
                    onBlur={(e) => onBlur(e.target.value)}
                    required={required}
                />
                {inputMsgEl}
            </>
        );
    }

    if ((type === 'select' || type === 'multi-select') && options?.length) {
        
        const htmlOptions = options?.map(({ label, value }) => {
            return (
                <option
                    key={`${name}-${value}`}
                    value={value}
                >
                    {label}
                </option>
            )
        });

        fieldContent = (
            <div className="form-group">
                <label htmlFor={name}>{label}</label>
                <select
                    id={name}
                    name={name}
                    className="form-control"
                    multiple={type === 'multi-select'}
                    value={_value}
                    onChange={(e) => {
                        let val = e.target.value;
                        if (type === 'multi-select') {
                            console.log('val > ', val);
                            if (_value.indexOf(val) > -1) {
                                val = (_value as string[]).filter((el: string) => el !== val) as any;
                                console.log('_value > ', _value, val);
                            } else {
                                val = [...(_value as any), val] as any;
                            }
                        }
                        setValue(val);
                        // addFormData({ [name]: val });
                    }}
                    onBlur={(e) => onBlur(e.target.value)}
                    required={required}
                >
                    {htmlOptions}
                </select>
                {inputMsgEl}
            </div>
        )
    } else if (type === 'select' && options?.length === 0) {
        throw new Error(`<Field> type provided as '${type}' but options prop is empty!`);
    }

    // TODO: support checkbox & radio

    return (
        <div className="form-group">
            {fieldContent}
        </div>
    );
}

export default Field;
