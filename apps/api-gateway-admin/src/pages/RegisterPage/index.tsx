import React, {
  useState,
  useEffect,
  FormEvent,
} from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { AuthStatus, signup } from '../../store/features/user';
import { Button, Field, Form } from '@node-api-gateway/ui';
import { newUserValidator } from '@node-api-gateway/validators';

function RegisterPage() {
  const { error, status } = useSelector((state: RootState) => state.auth);
  const history = useHistory();
  const dispatch = useDispatch();

  const handleSubmit = (data, e: FormEvent) => {
    dispatch(signup(data));
  }

  useEffect(() => {
    if (status === AuthStatus.loggedIn) {
      history.push('/login');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <div className="col-lg-8 offset-lg-2">
      <h2>Register</h2>
      <Form validations={newUserValidator.fields} submit={handleSubmit}>
        <Field name="firstName" label="First Name" />
        <Field name="lastName" label="Last Name" />
        <Field name="email" label="Email" />
        <Field type="password" name="password" label="Password" />
        <Button>
          {status === AuthStatus.loading && (
            <span className="spinner-border spinner-border-sm mr-1"></span>
          )}
          Sign Up
        </Button>
        <Link to="/login" className="btn btn-link">
          Cancel
        </Link>
      </Form>
    </div>
  );
}

export default RegisterPage;
