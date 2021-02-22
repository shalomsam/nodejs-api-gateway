import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { userActions } from '../actions';
import { RootState } from '../../client/helpers';
import clientActions from '../../client/actions/client.actions';
import ClientList from '../../client/components/ClientList';

function HomePage() {
    const clients = useSelector((state: RootState) => {
        return state.clients;
    });
    const user = useSelector((state: RootState) => state.authentication.user);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(clientActions.getAll());
    }, []);

    function handleDeleteUser(id: string) {
        dispatch(userActions.delete(id));
    }

    return (
        <div className="col">
            <h1>Hi {user.firstName}!</h1>
            <p>You're logged in with React Hooks!!</p>
            <h3>All registered Clients:</h3>
            {clients?.isLoading && <em>Loading Clients...</em>}
            {clients?.error && <span className="text-danger">ERROR: {clients?.error?.message}</span>}
            {!clients?.isLoading && !clients?.error && (
                <ClientList list={clients.list} />   
            )}
            <p>
                <Link to="/login">Logout</Link>
            </p>
        </div>
    );
}

export default HomePage;