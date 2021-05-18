import React, { useState, FormEvent, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuth, login, AuthStatus } from '../../store/features/user';

function LoginPage() {
  const { status } = useSelector(selectAuth);
  const history = useHistory();
  const dispatch = useDispatch();

  const [inputs, setInputs] = useState({
    email: '',
    password: '',
  });
  const { email, password } = inputs;

  const isEmailValid = !!email && email.indexOf('@') > -1;
  const isPasswordValid = !!password;

  const handleChange = (e) => {
    const { name, value } = e?.target;
    if (status !== AuthStatus.initial) {
      return;
    }
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (
      status === AuthStatus.initial && (isEmailValid && isPasswordValid)
    ) {
      dispatch(login(inputs));
    }
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
      <form name="form" onSubmit={handleSubmit} autoComplete="true">
        <div className="form-group">
          <label>Email</label>
          <input
            type="text"
            name="email"
            value={email}
            onChange={handleChange}
            className={
              'form-control' + (!isEmailValid ? ' is-invalid' : '')
            }
          />
          {!isEmailValid && (
            <div className="invalid-feedback">Email is required</div>
          )}
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
            className={
              'form-control' + (!isPasswordValid ? ' is-invalid' : '')
            }
          />
          {!isPasswordValid && (
            <div className="invalid-feedback">Password is required</div>
          )}
        </div>
        <div className="form-group">
          <button className="btn btn-primary">
            {status === AuthStatus.loading && (
              <span className="spinner-border spinner-border-sm mr-1"></span>
            )}
            Login
          </button>
          <Link to="/register" className="btn btn-link">
            Register
          </Link>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
