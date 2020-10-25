import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log('success');
  };

  return (
    <>
      <h1 class='large text-primary'>Sign In</h1>
      <p class='lead'>
        <i class='fas fa-user'></i> Sign into your account
      </p>
      <form class='form' onSubmit={onSubmit}>
        <div class='form-group'>
          <input
            type='email'
            name='email'
            value={email}
            onChange={onChange}
            placeholder='Email Address'
          />
        </div>
        <div class='form-group'>
          <input
            type='password'
            name='password'
            value={password}
            onChange={onChange}
            placeholder='Password'
            minlength='6'
          />
        </div>

        <input type='submit' value='Login' class='btn btn-primary' />
      </form>
      <p class='my-1'>
        Don't have an account? <Link to='/register'>Sign Up</Link>
      </p>
    </>
  );
}

export default Login;
