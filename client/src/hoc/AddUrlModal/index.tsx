import React, { FC, useContext } from 'react';
import { NotificationContext, NotificationTypes } from '../../components/Notification';
import Modal from '../../components/Modal';
import Field from '../../components/Form/Field';
import Form from '../../components/Form/Form';
import Button from '../../components/Button';

interface Props {
    showAddUrlModal: boolean;
    setShowAddUrlModal: (val: boolean) => void;
    onSuccess: (data: any) => void;
}

const AddUrlModal: FC<Props> = ({
    showAddUrlModal,
    setShowAddUrlModal,
    onSuccess
}) => {

    const { addNotification } = useContext(NotificationContext);

    const addShortUrl = async (formData: FormData) => {
        try {
            const result = await fetch('/api/shortUrl', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(Object.fromEntries(formData))
            });

            const response = await result.json();
            if (response.errors) {
                throw new Error(response);
            }
            addNotification({ type: NotificationTypes.success, message: 'New Short Url created!' });
            onSuccess(response);
            return response;
        } catch (e) {
            console.log('Error >> ', e);
            const message = e?.message || 'Error trying to create short url.';
            addNotification({ type: NotificationTypes.error, message });
            return { status: 'error', ...e };
        }
    }

    return (
        <Modal
            showModal={showAddUrlModal}
            onClose={() => {
                setShowAddUrlModal(false);
            }}
        >
            <div className='modal-body'>
                <Form
                    submit={async (formdata) => {
                        await addShortUrl(formdata);
                        setShowAddUrlModal(false);
                    }}
                >
                    <Field
                        type='select'
                        label='Http Code'
                        name='httpCode'
                        options={[
                            { label: '301', value: '301' },
                            { label: '302', value: '302' }
                        ]}
                    />
                    <Field
                        type='text'
                        label='From'
                        placeholder='Short Url'
                        name='shortUrl'
                        value=''
                    />
                    <Field
                        type='text'
                        label='To'
                        placeholder='Long Url'
                        name='longUrl'
                        value=''
                        required={true}
                    />
                    <Field
                        type='datetime-local'
                        label='Start Date'
                        name='startDate'
                        value=''
                    />
                    <Field
                        type='datetime-local'
                        label='End Date'
                        name='endDate'
                        value=''
                    />

                    <Button type={'submit'}>Submit</Button>
                </Form>
            </div>
        </Modal>
    )
}

export default AddUrlModal;
