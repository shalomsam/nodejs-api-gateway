import React, { FC } from 'react';

interface ButtonProps {
    type?: 'primary' | 'secondary' | 'submit';
    onClick?: () => void;
}

const Button: FC<ButtonProps> = ({ children, type = 'primary', onClick = () => {} }) => {
    let typeProp = {};

    if (type === 'submit') {
        type = 'primary';
        typeProp = { type: 'submit' };
    }

    return (
        <button
            {...typeProp}
            className={`btn btn-${type}`}
            onClick={onClick}
        >
            {children}
        </button>
    )
}

export default Button;
