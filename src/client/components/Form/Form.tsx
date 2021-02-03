import React, { FC } from 'react';

interface FormProps {
    submit: (formData: FormData, el: EventTarget, e: React.FormEvent) => void;
}

const Form: FC<FormProps> = ({ children, submit }) => {

    return (
        <form onSubmit={(e) => {
            const el = e.target;
            const formData = new FormData(e.target as any);
            submit(formData, el, e)
            e.preventDefault();
        }}>
            {children}
        </form>
    )
}

export default Form;
