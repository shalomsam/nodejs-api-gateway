import React, { ComponentType, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { AuthStatus, checkAuth, selectAuth } from '../store/features/user';
import { getAuthToken } from './auth';

export interface PrivateRouteProps extends RouteProps {
  component: ComponentType<any>;
}

export const PrivateRoute: React.FunctionComponent<PrivateRouteProps> = ({
  component: Component,
  ...rest
}: PrivateRouteProps) => {

  const dispatch = useDispatch();
  const auth = useSelector(selectAuth);

  useEffect(() => {
    if (auth.status === AuthStatus.initial) {
      dispatch(checkAuth());
    }
  }, [auth]);

  return (
    <Route
      {...rest}
      render={(props) => {

        if (auth.identity) {
          return <Component {...props} />;
        }

        return <Redirect
            to={{ pathname: '/login', state: { from: props.location } }}
          />;
      }}
    />
  );
};
