import React, { FC } from 'react';

interface FormProps {
    submit: (data: object, el: EventTarget, e: React.FormEvent, formData?: FormData) => void;
}

const Form: FC<FormProps> = ({ children, submit }) => {

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            const el = e.target;
            const formData = new FormData(e.target as any);
            let object = {};
            formData.forEach((value, key) => {
                object[key] = value;
            });
            
            submit(object, el, e, formData);
        }}>
            {children}
        </form>
    )
}

export default Form;
