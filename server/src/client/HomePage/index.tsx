import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { userActions } from '../actions';
import { RootState } from '../../client/helpers';
import { User } from '../../models/User';
import clientActions from '../../client/actions/client.actions';
import { Client } from 'models/Client';

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
        <div className="col-lg-8 offset-lg-2">
            <h1>Hi {user.firstName}!</h1>
            <p>You're logged in with React Hooks!!</p>
            <h3>All registered Clients:</h3>
            {clients?.isLoading && <em>Loading users...</em>}
            {clients?.error && <span className="text-danger">ERROR: {clients?.error?.message}</span>}
            {clients?.clients &&
                <ul>
                    {clients.clients.map((client: Client, index: number) =>
                        <li key={client._id}>
                            {/* {user.firstName + ' ' + user.lastName} */}
                            {/* {
                                user.deleting ? <em> - Deleting...</em>
                                : user.deleteError ? <span className="text-danger"> - ERROR: {user.deleteError}</span>
                                : <span> - <a onCli ck={() => handleDeleteUser(user._id)} className="text-primary">Delete</a></span>
                            } */}
                        </li>
                    )}
                </ul>
            }
            <p>
                <Link to="/login">Logout</Link>
            </p>
        </div>
    );
}

export default HomePage;