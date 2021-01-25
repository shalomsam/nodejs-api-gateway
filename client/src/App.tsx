import React, { useEffect, useState } from 'react';
import './App.css';
import ClientList, { IClientList } from './components/ClientList';
import 'bootstrap/dist/css/bootstrap.css';
import Notifications, { NotificationProvider, NotificationContext } from './components/Notification';
import Button from './components/Button';
import AddUrlModal from './hoc/AddUrlModal';
import { GlobalConfig } from './components/typings';

const App = () => {

    const [list, setList] = useState<IClientList[]>([]);
    const [globalConfig, setGlobalConfig] = useState<GlobalConfig | undefined>(undefined);
    const [showAddUrlModal, setShowAddUrlModal] = useState(false);

    useEffect(() => {
        const fetchUrlList = async () => {
            let data;
            try {
                const result = await fetch('/api/shorturl');
                data = await result.json();
                setList(data);
            } catch (e) {
                console.error('Error >>', e);
            }
        }

        const fetchConfig = async () => {
            let config;
            try {
                const result = await fetch('/api/config');
                config = await result.json();
                setGlobalConfig(config);
            } catch (e) {
                console.log('error > ', e);
            }
        }

        fetchConfig();
        fetchUrlList();
    }, []);

    return (
        <NotificationProvider>
            <div className="App">
                <h1>Clients:</h1>
                <div className='actionWrp'>
                    <Button onClick={() => setShowAddUrlModal(true)}>Add Short Url</Button>
                    {/*  */}
                    <AddUrlModal
                        showAddUrlModal={showAddUrlModal}
                        setShowAddUrlModal={setShowAddUrlModal}
                        onSuccess={(update: IClientList) => {
                            setList([...list, update])
                        }}
                    />
                </div>
                <ClientList config={globalConfig} list={list} />
            </div>
            <NotificationContext.Consumer>
                {({ notifications, setTtl }) => {
                    setTtl(1200);
                    return (
                        <Notifications notifications={notifications} />
                    )
                }}
            </NotificationContext.Consumer>
        </NotificationProvider>
    );
}

export default App;
