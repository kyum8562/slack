import loadable from '@loadable/component';
import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';

// 페이지별로 (lodable로) Code Spliting
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
      <Route path="/workspace/:workspace"><Workspace /></Route>
      {/* (:) 라우트 파라미터(와일드카드) 역할 : /workspace/test 처럼 입력이 된다. 
          와일드 카드는 같은 주소를 가지면 반드시 아래에 기술해야 한다.*/}
    </Switch>
  );
};

export default App;
