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
  
  // SWR??? ??????????????? ??????????????? ?????? ??????????????? ??????.
  // ????????? ?????? ????????? ?????????
  const {data: userData, error, mutate} = useSWR<IUser | false>(
    '/api/users', 
    fetcher,    
    {
      dedupingInterval: 2000, // 2???
    },
    );

  // ?????? ?????? ????????? ?????????
  const {data: channelData} = useSWR<IChannel[]>(
    userData? `/api/workspaces/${workspace}/channels` : null, 
    fetcher,
  );
    
  // ?????? ?????????????????? ?????? ????????? ?????????
  const {data: memberData} = useSWR<IChannel[]>(
    userData? `/api/workspaces/${workspace}/members` : null, 
    fetcher,
  );

  // ???????????? ????????? ??????
  const onLogout = useCallback(() => {
    axios.post('/api/users/logout', null,{
      withCredentials: true, // ?????? ?????? ??????
    })
    .then(() => {
      mutate(false, false);
    })
  }, []);

  // ?????? ????????? ????????? ??????
  const onClickUserProfile = useCallback((e) =>{
    e.stopPropagation();
    setShowUserMenu((prev) => !prev);
  }, []);

  // ?????????????????? ?????? - '+'  ??????
  const onClickCreateWorkspace = useCallback(() => {
    setShowCreateWorkspaceModal(true);
  }, []);

  // ?????????????????? ?????? - ?????? ?????? '????????????' ??????
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
      // ????????? ?????? ????????? Workspace??? ?????????, ????????? ????????? ?????? ??? ?????? ???????????? ??????
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

  // ????????? ?????? ???
  const onCloseModal = useCallback(() => {
    setShowCreateWorkspaceModal(false);
    setShowCreateChannelModal(false);
    setShowInviteChannelModal(false);
    setShowInviteWorkspaceModal(false);
  }, []);

  // ?????????????????? ?????? ??????
  const toggleWorkspaceModal = useCallback(() =>{
    setshowWorkspaceModal((prev) => !prev);
  }, []);

  // ?????? ?????? ??????
  const onClickAddChannel = useCallback(() => {
    setShowCreateChannelModal(true);
  }, []);

  // ?????????????????? ?????? (?????? && ?????????????????? ?????? ??? ??????????????????)
  const onClickInviteWorkspace = useCallback(() => {
    setShowInviteWorkspaceModal(true);
  }, []);
  // ???????????? ????????? ????????? ???????????? ??????
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
              (<Menu style={{right:0, top: 38}} show={showUserMenu} onCloseModal={onClickUserProfile}>???????????????
              <ProfileModal>
                <img src={gravatar.url(userData.email, {s: '28px', d:'retro'})} alt={userData.email} />
                <div>
                  <span id="profile-name">{userData.email}</span>
                  <span id="profile-active">Active</span>
                </div>
              </ProfileModal>
              <LogOutButton onClick={onLogout}>????????????</LogOutButton>
              </Menu>
              )}
          </span>
        </RightMenu>
      </Header>
      <WorkspaceWrapper>
        <Workspaces>
          {userData?.Workspaces.map((ws) =>{
            return(
              <Link key={ws.id} to={`/workspace/${123}/channel/??????`}>
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
                <button onClick={onClickInviteWorkspace}>????????????????????? ????????? ??????</button>
                <button onClick={onClickAddChannel}>?????? ?????????</button>
                <button onClick={onLogout}>????????????</button>
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
            <span>?????????????????? ??????</span>
            <input id='workspace' value={newWorkspace} onChange={onChangeNewWorkspace}></input>
          </label>
          <label id='workspace-url-label'>
            <span>?????????????????? url</span>
            <input id='workspace' value={newUrl} onChange={onChangeNewUrl}></input>
          </label>
          <Button type='submit'>????????????</Button>
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