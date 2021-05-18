import React, {
  useState,
  useEffect,
  FormEvent,
} from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { AuthStatus, signup } from '../../store/features/user';

function RegisterPage() {
  const [userInput, setUserInput] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const { error, status } = useSelector((state: RootState) => state.auth);
  const history = useHistory();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInput((user) => ({ ...user, [name]: value }));
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (
      userInput.firstName &&
      userInput.lastName &&
      userInput.email &&
      userInput.password
    ) {
      dispatch(signup(userInput));
    }
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
      <form name="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            value={userInput.firstName}
            onChange={handleChange}
            className={
              'form-control' +
              (error && !userInput.firstName ? ' is-invalid' : '')
            }
          />
          {!userInput.firstName && (
            <div className="invalid-feedback">First Name is required</div>
          )}
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={userInput.lastName}
            onChange={handleChange}
            className={
              'form-control' +
              (error && !userInput.lastName ? ' is-invalid' : '')
            }
          />
          {!userInput.lastName && (
            <div className="invalid-feedback">Last Name is required</div>
          )}
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="text"
            name="email"
            value={userInput.email}
            onChange={handleChange}
            className={
              'form-control' +
              (error && !userInput.email ? ' is-invalid' : '')
            }
          />
          {!userInput.email && (
            <div className="invalid-feedback">Email is required</div>
          )}
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={userInput.password}
            onChange={handleChange}
            className={
              'form-control' +
              (error && !userInput.password ? ' is-invalid' : '')
            }
          />
          {error && !userInput.password && (
            <div className="invalid-feedback">Password is required</div>
          )}
        </div>
        <div className="form-group">
          <button className="btn btn-primary">
            {status === AuthStatus.loading && (
              <span className="spinner-border spinner-border-sm mr-1"></span>
            )}
            Register
          </button>
          <Link to="/login" className="btn btn-link">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

export default RegisterPage;
