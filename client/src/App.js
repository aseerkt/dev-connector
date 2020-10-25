import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Landing from './components/layout/Landing';
import Navbar from './components/layout/Navbar';
import './App.css';
import Register from './components/auth/Register';
import Login from './components/auth/Login';

const App = () => (
  <BrowserRouter>
    <Navbar />
    <Route exact path='/' component={Landing} />
    <section className='container'>
      <Switch>
        <Route exact path='/register' component={Register} />
        <Route exact path='/login' component={Login} />
      </Switch>
    </section>
  </BrowserRouter>
);

export default App;
