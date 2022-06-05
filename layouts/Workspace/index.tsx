import CreateChannelModal from '@components/CreateChannelModal';
import Modal from '@components/Modal/index';
import DMList from '@components/DMList';
import Menu from '@components/Menu/index';
import InviteWorkspaceModal from '@components/inviteWorkspaceModal';
import InviteChannelModal from '@components/InviteChannelModal';
import ChannelList from '@components/ChannelList';

import { Button, Input, Label } from '@pages/SignUp/styles';
import useSWR from 'swr';
import gravatar from 'gravatar';
import {toast} from 'react-toastify';
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
import loadable from '@loadable/component';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { Children, VFC, useCallback, useState } from 'react';
import { Redirect, Route, Switch, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { IChannel, IUser } from '@typings/db';
import useInput from '@hooks/useInput';

const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));
        

const Workspace: VFC = () => {
  const[showUserMenu, setShowUserMenu] = useState(false);
  const[showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
  const[showInviteWorkspaceModal, setShowInviteWorkspaceModal] = useState(false);
  const[showInviteChannelModal, setShowInviteChannelModal] = useState(false);
  const[showWorkspaceModal, setshowWorkspaceModal] = useState(false);
  const[showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const[newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput('');
  const[newUrl, onChangeNewUrl, setNewUrl] = useInput('');

  const {workspace} = useParams<{workspace: string}>();
  
  // SWR이 컴포넌트를 넘나들면서 전역 스토리지가 된다.
  // 사용자 전역 데이터 가져옴
  const {data: userData, error, mutate} = useSWR<IUser | false>(
    '/api/users', 
    fetcher,    
    {
      dedupingInterval: 2000, // 2초
    },
    );

  // 채널 전역 데이터 가져옴
  const {data: channelData} = useSWR<IChannel[]>(
    userData? `/api/workspaces/${workspace}/channels` : null, 
    fetcher,
  );
    
  // 전역 워크스페이스 멤버 데이터 가져옴
  const {data: memberData} = useSWR<IChannel[]>(
    userData? `/api/workspaces/${workspace}/members` : null, 
    fetcher,
  );

  // 로그아웃 클릭시 함수
  const onLogout = useCallback(() => {
    axios.post('/api/users/logout', null,{
      withCredentials: true, // 쿠키 서로 공유
    })
    .then(() => {
      mutate(false, false);
    })
  }, []);

  // 헤더 프로필 클릭시 함수
  const onClickUserProfile = useCallback((e) =>{
    e.stopPropagation();
    setShowUserMenu((prev) => !prev);
  }, []);

  // 워크스페이스 생성 - '+'  함수
  const onClickCreateWorkspace = useCallback(() => {
    setShowCreateWorkspaceModal(true);
  }, []);

  // 워크스페이스 생성 - 모달 내의 '생성하기' 함수
  const onCreateWorkSpace = useCallback((e) =>{
    e.preventDefault();
    if(!newWorkspace || !newWorkspace.trim()) return;
    if(!newUrl || !newUrl.trim()) return;
    axios.post('/api/workspaces', 
      {
        workspace: newWorkspace,
        url: newUrl,
      }, 
      {
        withCredentials: true,
      },
    )
      // 입력을 받고 새로운 Workspace를 생성시, 그다음 입력을 받을 때 값을 지워주기 위해
      .then(() =>{
        mutate();
        setShowCreateWorkspaceModal(false);
        setNewWorkspace('');
        setNewUrl('');
      })
      .catch((error) => {
        console.dir(error);
        toast.error(error.response?.data, {position: 'bottom-center'});
      });
  }, [newWorkspace, newUrl]);

  // 모달창 닫을 때
  const onCloseModal = useCallback(() => {
    setShowCreateWorkspaceModal(false);
    setShowCreateChannelModal(false);
    setShowInviteChannelModal(false);
    setShowInviteWorkspaceModal(false);
  }, []);

  // 워크스페이스 모달 토글
  const toggleWorkspaceModal = useCallback(() =>{
    setshowWorkspaceModal((prev) => !prev);
  }, []);

  // 채널 생성 토글
  const onClickAddChannel = useCallback(() => {
    setShowCreateChannelModal(true);
  }, []);

  // 워크스페이스 초대 (슬랙 && 워크스페이스 가입 및 들어가있다면)
  const onClickInviteWorkspace = useCallback(() => {
    setShowInviteWorkspaceModal(true);
  }, []);
  // 데이터가 없으면 로그인 페이지로 보냄
  if(!userData){
    return <Redirect to ="/login" />
  }
  
  return(
    <div>
      <Header>
        <RightMenu>
          <span onClick={onClickUserProfile}>
            <ProfileImg src={gravatar.url(userData.email, {s: '28px', d:'retro'})} alt={userData.email} />
            {showUserMenu &&
              (<Menu style={{right:0, top: 38}} show={showUserMenu} onCloseModal={onClickUserProfile}>프로필메뉴
              <ProfileModal>
                <img src={gravatar.url(userData.email, {s: '28px', d:'retro'})} alt={userData.email} />
                <div>
                  <span id="profile-name">{userData.email}</span>
                  <span id="profile-active">Active</span>
                </div>
              </ProfileModal>
              <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
              </Menu>
              )}
          </span>
        </RightMenu>
      </Header>
      <WorkspaceWrapper>
        <Workspaces>
          {userData?.Workspaces.map((ws) =>{
            return(
              <Link key={ws.id} to={`/workspace/${123}/channel/일반`}>
                <WorkspaceButton>{ws.name.slice(0,1).toUpperCase()}</WorkspaceButton>
              </Link>
            );
          })}
          <AddButton onClick={onClickCreateWorkspace}>+</AddButton>
        </Workspaces>
        <Channels>
          <WorkspaceName onClick={toggleWorkspaceModal}>Sleact</WorkspaceName>
          <MenuScroll>
            <Menu show={showWorkspaceModal} onCloseModal={toggleWorkspaceModal} style={{top: 95, left: 80}}>
              <WorkspaceModal>
                <h2>Sleact</h2>
                <button onClick={onClickInviteWorkspace}>워크스페이스에 사용자 초대</button>
                <button onClick={onClickAddChannel}>채널 만들기</button>
                <button onClick={onLogout}>로그아웃</button>
              </WorkspaceModal>
            </Menu>
            <ChannelList />
            <DMList />
          </MenuScroll>
        </Channels>
        <Chats>
          <Switch>
            <Route path="/workspace/:workspace/channel/:channel" component={Channel} />
            <Route path="/workspace/:workspace/dm/:id" component={DirectMessage} />
          </Switch>
        </Chats>
      </WorkspaceWrapper>
      <Modal show={showCreateWorkspaceModal} onCloseModal={onCloseModal}>
        <form onSubmit={onCreateWorkSpace}>
          <label id='workspace-label'>
            <span>워크스페이스 이름</span>
            <input id='workspace' value={newWorkspace} onChange={onChangeNewWorkspace}></input>
          </label>
          <label id='workspace-url-label'>
            <span>워크스페이스 url</span>
            <input id='workspace' value={newUrl} onChange={onChangeNewUrl}></input>
          </label>
          <Button type='submit'>생성하기</Button>
        </form>
      </Modal>
      <CreateChannelModal 
        show={showCreateChannelModal} 
        onCloseModal={onCloseModal} 
        setShowCreateChannelModal={setShowCreateChannelModal}
      />
      <InviteWorkspaceModal 
        show={showInviteWorkspaceModal} 
        onCloseModal={onCloseModal} 
        setShowInviteWorkspaceModal={setShowInviteWorkspaceModal}>
      </InviteWorkspaceModal>
      <InviteChannelModal 
        show={showInviteChannelModal} 
        onCloseModal={onCloseModal} 
        setShowInviteChannelModal={setShowInviteChannelModal}>
      </InviteChannelModal>
    </div>
  );

}

export default Workspace;