import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { isSSR } from '../../../client/helpers';

function PrivateRoute({ component: Component, roles, ...rest }: any) {
    return (
        <Route {...rest} render={props => {
            if (!isSSR && localStorage.getItem('user')) {
                // logged in so return component
                return <Component {...props} />    
            }
            // not logged in so redirect to login page with the return url
            return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
            
        }} />
    );
}

export default PrivateRoute;