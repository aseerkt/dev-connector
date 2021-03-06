import axios from 'axios';
import setAuthToken from '../../utils/setAuthToken';
import { setAlert } from './alert';
import {
  AUTH_ERROR,
  CLEAR_PROFILE,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT,
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  USER_LOADED,
} from './types';

// Load User
export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  try {
    const res = await axios.get('/api/auth');
    dispatch({ type: USER_LOADED, payload: res.data });
  } catch (err) {
    console.log(err);
    dispatch({ type: AUTH_ERROR });
  }
};

// Register User
export const register = ({ name, email, password }) => async (dispatch) => {
  const config = { headers: { 'Content-Type': 'application/json' } };
  const body = JSON.stringify({ name, email, password });
  try {
    const res = await axios.post('/api/users', body, config);
    console.log(res.data.token);
    dispatch({ type: REGISTER_SUCCESS, payload: res.data.token });
    dispatch(loadUser());
  } catch (err) {
    dispatch({ type: REGISTER_FAIL });

    return;
  }
};

// Login User
export const login = (email, password) => async (dispatch) => {
  try {
    const res = await axios.post('/api/auth', { email, password });
    dispatch({ type: LOGIN_SUCCESS, payload: res.data.token });
    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

// Logout User
export const logout = () => (dispatch) => {
  console.log('reached');
  dispatch({ type: CLEAR_PROFILE });
  dispatch({ type: LOGOUT });
};
