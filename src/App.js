import React from 'react';
import { Route } from 'react-router-dom';
import Home from './Home';
import Profile from './Profile';
import Nav from './Nav';
import Auth from './Auth/Auth';
import Callback from './Callback';

export default function App(props) {
  const auth = new Auth(props.history);

  return (
    <>
    <Nav />
    <div className="body">
      <Route
        path="/" exact render={props => <Home auth={auth} {...props} />}
      />
      <Route
        path="/callback" exact render={props => <Callback auth={auth} {...props} />}
      />
      <Route path="/profile" component={Profile} />
    </div>
    </>
  );
}
