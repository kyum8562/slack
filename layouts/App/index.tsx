import loadable from '@loadable/component';
import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';

// 페이지별로 Code Spliting
const LogIn = loadable(() => import('@pages/Login'));
const SignUp = loadable(() => import('@pages/SignUp'));
const Workspace = loadable(() => import('@layouts/Workspace'));

// ts react-router-dom 5버전 사용
const App = () => {
  return(
    <Switch>
      <Redirect exact path='/' to ="/login" />
      <Route path="/login"><LogIn /></Route>
      <Route path="/signup"><SignUp /></Route>
      <Route path="/workspace"><Workspace /></Route>
    </Switch>
  );
};

export default App;
