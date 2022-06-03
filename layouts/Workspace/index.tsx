import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { Children, FC, useCallback } from 'react';
import { Redirect, Route, Switch } from 'react-router';
import useSWR from 'swr';
import Menu from '@components/Menu/index';
import gravatar from 'gravatar';
import loadable from '@loadable/component';
import {RightMenu, 
        Header, 
        ProfileImg, 
        ProfileModal, 
        LogOutButton, 
        WorkspaceWrapper, 
        Workspaces, 
        Channels,
        WorkspaceName, 
        MenuScroll, 
        WorkspaceModal, 
        Chats, 
        AddButton, 
        WorkspaceButton} from '@layouts/Workspace/styles';

const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));
        

const Workspace: FC = ({children}) => {
  // SWR이 컴포넌트를 넘나들면서 전역 스토리지가 된다.
  const {data, error, mutate} = useSWR('http://localhost:3095/api/users', fetcher);

  const onLogout = useCallback(() => {
    axios.post('http://localhost:3095/api/users/logout', null,{
      withCredentials: true, // 쿠키 서로 공유
    })
    .then(() => {
      mutate(false, false);
    })
  }, []);

  // 데이터가 없으면 로그인 페이지로 보냄
  if(!data){
    return <Redirect to ="/login" />
  }
  
  return(
    <div>
      <Header>
        <RightMenu>
          <span>
            <ProfileImg src={gravatar.url(data.email, {s: '28px', d:'retro'})} alt={data.email} />
            <Menu>프로필메뉴</Menu>
          </span>
        </RightMenu>
      </Header>
      <button onClick={onLogout}>로그아웃</button>
      <WorkspaceWrapper>
        <Workspaces>test</Workspaces>
        <Channels>
          <WorkspaceName>Sleact</WorkspaceName>
          <MenuScroll>menu 1</MenuScroll>
        </Channels>
        <Chats>Chats</Chats>
        <Switch>
          <Route path="/workspace/channel" component={Channel}></Route>
          <Route path="/workspace/dm" component={DirectMessage}></Route>
        </Switch>
      </WorkspaceWrapper>
    </div>
  );

}

export default Workspace;