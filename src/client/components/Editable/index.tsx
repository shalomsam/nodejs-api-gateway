import React, { FC, useState } from 'react';

interface Props {
    type?: string;
    onUpdate: (args: any) => void;
}

const Editable: FC<Props> = ({ children, type = 'text', onUpdate }) => {

    const [text, setText] = useState(children?.toString());
    const [isEditing, setIsEditing] = useState(false);

    const getChildContent = () => {
        if (isEditing) {
            return (
                <input
                    type={type}
                    name='mockInput'
                    value={text} 
                    onChange={(e) => {
                        const newVal = e.target.value;
                        if (newVal !== text) {
                            setText(e.target.value)
                        }
                    }}
                    onBlur={(e) => {
                        if (e.target.value) {
                            onUpdate(text);
                            setIsEditing(false);
                        }
                    }}
                />
            )
        } else {
            return text;
        }
    }

    return (
        <span
            onClick={() => {
                if (!isEditing) {
                    setIsEditing(true);
                }
            }}
        >
            {getChildContent()}
        </span>
    )
}

export default Editable;
