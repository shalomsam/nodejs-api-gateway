import React, { FC } from 'react';

export interface FormProps {
    submit: (data: Record<string, unknown>, el: EventTarget, e: React.FormEvent, formData?: FormData) => void;
}

export const Form: FC<FormProps> = ({ children, submit }) => {

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            const el = e.target;
            const formData = new FormData(e.target as any);
            const object = {};
            formData.forEach((value, key) => {
                object[key] = value;
            });
            
            submit(object, el, e, formData);
        }}>
            {children}
        </form>
    )
}
