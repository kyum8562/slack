import loadable from '@loadable/component';
import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';

const LogIn = loadable(() => import('@pages/Login'));
const SignUp = loadable(() => import('@pages/SignUp'));

// ts react-router-dom 5버전 사용
const App = () => {
  return(
    <Switch>
      <Redirect exact path='/' to ="/login" />
      <Route path="/login"><LogIn /></Route>
      <Route path="/signup"><SignUp /></Route>
    </Switch>
  );
};

export default App;
