import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import Spinner from '../layout/Spinner';

function PrivateRoute({ component: Component, ...rest }) {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  if (loading) {
    return <Spinner />;
  }
  return (
    <Route
      {...rest}
      render={(props) =>
        !isAuthenticated ? <Redirect to='/login' /> : <Component {...props} />
      }
    />
  );
}

export default PrivateRoute;
