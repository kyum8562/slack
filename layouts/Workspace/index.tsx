import fetcher from '@utils/fetcher';
import Modal from '@components/Modal/index';
import CreateChannelModal from '@components/CreateChannelModal';
import Menu from '@components/Menu/index';
import loadable from '@loadable/component';
import axios from 'axios';
import React, { Children, VFC, useCallback, useState } from 'react';
import { Redirect, Route, Switch, useParams } from 'react-router';
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
import { Link } from 'react-router-dom';
import { IChannel, IUser } from '@typings/db';
import useInput from '@hooks/useInput';
import InviteWorkspaceModal from '@components/inviteWorkspaceModal';
import InviteChannelModal from '@components/InviteChannelModal';

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
  const {data: userData, error, mutate} = useSWR<IUser | false>(
    'http://localhost:3095/api/users', 
    fetcher
    );
    const {data: channelData} = useSWR<IChannel[]>(
      userData? `http://localhost:3095/api/workspaces/${workspace}/channels` : null, 
      fetcher,
    );
    
    const onLogout = useCallback(() => {
      axios.post('http://localhost:3095/api/users/logout', null,{
        withCredentials: true, // 쿠키 서로 공유
    })
    .then(() => {
      mutate(false, false);
    })
  }, []);

  const onClickUserProfile = useCallback((e) =>{
    e.stopPropagation();
    setShowUserMenu((prev) => !prev);
  }, []);

  const onClickCreateWorkspace = useCallback(() => {
    setShowCreateWorkspaceModal(true);
  }, []);

  const onCreateWorkSpace = useCallback((e) =>{
    e.preventDefault();
    if(!newWorkspace || !newWorkspace.trim()) return;
    if(!newUrl || !newUrl.trim()) return;
    axios.post('http://localhost:3095/api/workspaces', 
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

  const onCloseModal = useCallback(() => {
    setShowCreateWorkspaceModal(false);
    setShowCreateChannelModal(false);
    setShowInviteChannelModal(false);
    setShowInviteWorkspaceModal(false);
  }, []);

  const toggleWorkspaceModal = useCallback(() =>{
    setshowWorkspaceModal((prev) => !prev);
  }, []);

  const onClickAddChannel = useCallback(() => {
    setShowCreateChannelModal(true);
  }, []);

  const onClickInviteWorkspace = useCallback(() => {

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
            {channelData?.map((v) => (<div>{v.name}</div>))}
          </MenuScroll>
        </Channels>
        <Chats>Chats</Chats>
        <Switch>
          <Route path="/workspace/channel/:channel" component={Channel}></Route>
          <Route path="/workspace/dm/:id" component={DirectMessage}></Route>
        </Switch>
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