import React, { FC, useState } from 'react';
import './clientlist.module.scss';
import { Client } from '@node-api-gateway/api-interfaces';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboard } from '@fortawesome/free-solid-svg-icons';
import {
  Table,
  Button,
  Modal,
  Form,
  Field,
  Tooltip,
} from '@node-api-gateway/ui';
import { addClient } from '../../store/features/client';
import { useAppDisatch } from '../../store/store';
import { newClientValidator } from '@node-api-gateway/validators';


interface Props {
  list: Client[];
}

const ClientList: FC<Props> = ({ list = [] }: Props) => {
  const dispatch = useAppDisatch();
  const editableProps: Partial<keyof Client>[] = ['name', 'dailyLimit'];

  const [showAddModal, setShowAddModal] = useState(false);

  const content = list.sort((a, b) =>
    a.createdAt < b.createdAt ? -1 : a.createdAt > b.createdAt ? 1 : 0
  );

  const headers = [
    'name',
    'apiPublicKey',
    'secret',
    'basePath',
    'clientEndpoint',
  ];

  return (
    <>
      <Button onClick={() => setShowAddModal(true)}>Add New Client</Button>
      <Modal showModal={showAddModal}>
        <div className="modal-body">
          <Form
            validations={newClientValidator.fields}
            submit={async (formdata) => {
              await dispatch(addClient(formdata));
              setShowAddModal(false);
            }}
          >
            <Field
              type="text"
              label="Name"
              placeholder="Client App Name OR Service Name"
              name="name"
            />
            <Field
              type="number"
              label="Daily Limit"
              placeholder="Daily rate limit for Client App/Service (0 = unlimited)"
              name="dailyLimit"
            />
            <Field
              type="text"
              label="BasePath"
              placeholder="BasePath is the path to assign to this Client/Service under the GateWay domain (eg: portal.domain.com{/basePath})"
              name="basePath"
            />
            <Field
              type="text"
              label="Client URL/IP"
              placeholder="URL/IP to the application host (eg: https://www.domain.com/api/v1/)"
              name="clientEndpoint"
            />
            <Button type="submit">Add New</Button>
          </Form>
        </div>
      </Modal>
      <Table
        columnHeaders={headers}
        contents={content}
        filters={{
          secret: (value, key) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const [show, setShow] = useState(false);
            const setTimeoutShow = (timeout = 500) => {
              setShow(true);
              setTimeout(() => {
                setShow(false);
              }, timeout);
            };
            return (
              <>
                <span
                  className="d-inline-block text-truncate"
                  style={{ maxWidth: '150px' }}
                >
                  {value}
                </span>
                <div className="position-relative">
                  <FontAwesomeIcon
                    style={{ right: '1px', position: 'relative' }}
                    icon={faClipboard}
                    onClick={() => {
                      navigator.clipboard.writeText(String(value));
                      setTimeoutShow();
                    }}
                  />
                  <Tooltip show={show}>Copied!</Tooltip>
                </div>
              </>
            );
          },
        }}
      />
    </>
  );
};

export default ClientList;
