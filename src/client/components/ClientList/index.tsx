import React, { FC, useState } from 'react';
import './styles.css';
import { GlobalConfig } from '../typings';
import { Client } from '../../../models/Client';
import clientServices from '../../../client/services/client.services';
import { useDispatch } from 'react-redux';
import { alertActions } from '../../../client/actions';
import Table from '../Table';
import Button from '../Button';
import Modal from '../Modal';
import Form from '../Form/Form';
import Field from '../Form/Field';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboard } from '@fortawesome/free-solid-svg-icons';
import Tooltip from '../Tooltip';

interface Props {
    list: Client[];
    config?: GlobalConfig;
}

const ClientList: FC<Props>  = ({ list = [], config }: Props) => {

    const dispatch = useDispatch();
    const editableProps: Partial<(keyof Client)>[] = ['name', 'dailyLimit'];

    const update = async (id: string, data: Partial<Client>) => {
        if (data && id) {
            const response = await clientServices.update(id, data);
            if (response.error) {
                dispatch(alertActions.error(response?.message || 'Update failed!'));
                return false;
            } else {
                dispatch(alertActions.success('Successfully Updated!'));
                return response;
            }
        }

        return false;
    }

    const addNew = async (data: Partial<Client> & any) =>{
        const response = await clientServices.add(data);
        if (response && !response?.error) {
            dispatch(alertActions.success('Successfully Add new Client!'));
            return response;
        } else {
            dispatch(alertActions.error(response?.message || 'Add New failed!'));
            return false;
        }
    }

    const [showAddModal, setShowAddModal] = useState(false);

    const content = list
        .sort((a, b) => (a.createdAt < b.createdAt) ? -1 : ((a.createdAt > b.createdAt) ? 1 : 0));

    let headers = ['name', 'apiPublicKey', 'secret', 'basePath', 'clientEndPoint'];

    return (
        <>
            <Button onClick={() => setShowAddModal(true)}>Add New Client</Button>
            <Modal showModal={showAddModal}>
                <div className='modal-body'>
                    <Form
                        submit={async (formdata) => {
                            console.log('formdata >> ', formdata);
                            await addNew(formdata);
                            setShowAddModal(false);
                        }}
                    >
                        <Field
                            type='text'
                            label='Name'
                            placeholder='Client App/Service Name'
                            name='name'
                            value=''
                        />
                        <Field
                            type='text'
                            label='Daily Limit'
                            placeholder='Daily rate limit for Client App/Service (0 = unlimited)'
                            name='dailyLimit'
                            value='0'
                        />
                        <Button type='submit'>
                            Add New
                        </Button>
                    </Form>
                </div>
            </Modal>
            <Table
                columnHeaders={headers}
                contents={content}
                filters={{
                    'secret': (value, key) => {
                        const [show, setShow] = useState(false);
                        const setTimeoutShow = (timeout = 500) => {
                            setShow(true);
                            setTimeout(() => {
                                setShow(false)
                            }, timeout);
                        }
                        return (
                            <>
                                <span className="d-inline-block text-truncate" style={{maxWidth: '150px'}}>
                                    {value}
                                </span>
                                <div className="position-relative">
                                    <FontAwesomeIcon
                                        style={{ right: '1px', position: 'relative' }}
                                        icon={faClipboard}
                                        onClick={() => {
                                            navigator.clipboard.writeText(value);
                                            setTimeoutShow();
                                        }}
                                    />
                                    <Tooltip
                                        show={show}
                                    >
                                        Copied!
                                    </Tooltip>
                                </div>
                            </>
                        )
                    }
                }}
            />
        </>
    )
}

export default ClientList;
