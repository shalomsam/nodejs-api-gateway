import React, { FC, useState } from 'react';
import './modal.scss';

export interface ModalProps {
    showModal: boolean;
    title?: string;
    onClose?: () => void;
}

const defaultOnClose = () => {
    console.warn('Modal: `onClose` callback fn should set prop showModal to false!');
}

export const Modal: FC<ModalProps> = ({ children, title, showModal = false, onClose = defaultOnClose }) => {
    const timeOut = 100;
    const [show, setShow] = useState('');

    const closeFn = () => {
        setTimeout(() => {
            onClose();
        }, timeOut)
    };

    if (showModal) {
        setTimeout(() => setShow('show'), timeOut);
        return (
            <div className='modalWrp'>
                <div
                    className={`modal fade ${show}`}
                    tabIndex={-1}
                    role='dialog'
                >
                    <div
                        className={`modal-backdrop fade ${show}`}
                        onClick={closeFn}
                    />
                    <div 
                        className='modal-dialog'
                        role='document'
                    >
                        <div className='modal-content'>
                            <div className='modal-header'>
                                {title && <h5 className="modal-title" id="exampleModalLabel">{title}</h5>}
                                <button
                                    onClick={closeFn}
                                    type="button"
                                    className="close"
                                    data-dismiss="modal"
                                    aria-label="Close"
                                >
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}

