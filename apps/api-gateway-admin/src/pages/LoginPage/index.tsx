import React, { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuth, login, AuthStatus } from '../../store/features/user';
import { Button, Field, Form } from '@node-api-gateway/ui';
import { loginValidator } from '@node-api-gateway/validators'


function LoginPage() {
  const { status } = useSelector(selectAuth);
  const history = useHistory();
  const dispatch = useDispatch();


  const handleSubmit = (data, e) => {
    dispatch(login(data));
  }

  useEffect(() => {
    if (status === AuthStatus.loggedIn) {
      history.push('/home');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <div className="col-lg-8 offset-lg-2">
      <h2>Login</h2>
      <Form validations={loginValidator.fields} submit={handleSubmit}>
        <Field label="Email" name="email" />
        <Field type="password" label="Password" name="password" />
        <Button>
          {status === AuthStatus.loading && (
            <span className="spinner-border spinner-border-sm mr-1"></span>
          )}
          Log in
        </Button>
        <Link to="/register" className="btn btn-link">
          Register
        </Link>
      </Form>
    </div>
  );
}

export default LoginPage;
