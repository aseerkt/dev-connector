import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAlert } from '../../redux/actions/alert';
import { register } from '../../redux/actions/auth';
import { Link, Redirect } from 'react-router-dom';

function Register() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  });
  const { name, email, password, password2 } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    if (password !== password2) {
      dispatch(setAlert('Passwords do not match', 'danger'));
    } else {
      dispatch(register({ name, email, password }));
    }
  };

  if (isAuthenticated) {
    return <Redirect to='/dashboard' />;
  }

  return (
    <>
      <h1 className='large text-primary'>Sign Up</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Create your account
      </p>
      <form className='form' onSubmit={onSubmit}>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Name'
            name='name'
            value={name}
            onChange={onChange}
          />
        </div>
        <div className='form-group'>
          <input
            type='email'
            name='email'
            value={email}
            onChange={onChange}
            placeholder='Email Address'
            autoComplete='username'
          />
          <small className='form-text'>
            This site uses Gravatar, so if you want a profile image, use a
            Gravatar email
          </small>
        </div>
        <div className='form-group'>
          <input
            type='password'
            name='password'
            value={password}
            onChange={onChange}
            placeholder='Password'
            autoComplete='new-password'
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            name='password2'
            value={password2}
            onChange={onChange}
            placeholder='Confirm Password'
            autoComplete='new-password'
          />
        </div>
        <input type='submit' value='Register' className='btn btn-primary' />
      </form>
      <p className='my-1'>
        Already have an account? <Link to='/login'>Sign In</Link>
      </p>
    </>
  );
}

export default Register;
