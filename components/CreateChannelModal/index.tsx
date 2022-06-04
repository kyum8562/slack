import Modal from '@components/Modal';
import useInput from '@hooks/useInput';
import { Button } from '@pages/SignUp/styles';
import { IChannel, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, {useCallback, VFC} from 'react';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import useSWR from 'swr';

interface Props{
  show: boolean;
  onCloseModal: () => void;
  setShowCreateChannelModal: (flag: boolean) => void;
}

const CreateChannelModal: VFC<Props> = ({show, onCloseModal, setShowCreateChannelModal}) => {
  const [newChannel, onChangeNewChannel, setNewChannel] = useInput('');
  // useParams : 파라미터 자리에 있는 데이터를 useParams로 가져올 수 있음
  // 주소 자체에 데이터를 가지고 있게 되므로 매우 편하다(필수)
  const { workspace, channel} = useParams<{workspace: string, channel: string}>();
  const {data: userData, error, mutate} = useSWR<IUser | false>(
    'http://localhost:3095/api/users', 
    fetcher,
    {
      dedupingInterval: 2000,
    }
    );

  const {data: channelData, mutate: mutateChannel} = useSWR<IChannel[]>(
    userData ? `http://localhost:3095/api/workspaces/${workspace}/channels` : null, 
    fetcher,
  );

  const onCreatechannel = useCallback((e) => {
    e.preventDefault();
    axios.post(`http://localhost:3095/api/workspaces/${workspace}/channels`, 
      { // 서버는 새롭게 생성할 채널의 '이름'을 알게 됨
        name: newChannel,
      }, 
      { // 서버는 '누가' 생성했는지 알게 됨(쿠키를 통해)
        withCredentials: true,
      },
    ).then(() => {
      setShowCreateChannelModal(false);
      mutateChannel(); // 생성하자마자 채널 리스트 불러오기
      setNewChannel('');
    })
      .catch((error) => {
        console.dir(error);
        toast.error(error.reeponse?.data, {position: 'bottom-center'})
      })
  }, [newChannel]);


  if(!show) return null;

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onCreatechannel}>
        <label id='channel-label'>
          <span>워크스페이스 이름</span>
          <input id='channel' value={newChannel} onChange={onChangeNewChannel} />
        </label>
        <Button type='submit'>생성하기</Button>
      </form>
    </Modal>
  );
}

export default CreateChannelModal;