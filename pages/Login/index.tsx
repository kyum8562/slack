import useInput from '@hooks/useInput';
import fetcher from '@utils/fetcher';
import { Form, Error, Label, Input, LinkContainer, Button, Header } from '@pages/SignUp/styles';
import axios from 'axios';
import React, { useCallback, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import useSWR from 'swr';

const LogIn = () => {
  // SWR이 컴포넌트를 넘나들면서 전역 스토리지가 된다.
  const {data, error, mutate} = useSWR('/api/users', fetcher
  // ,{dedupingInterval: 100000, // 캐시의 유지기간을 설정
  ); // useSWR: 로그인 후에 서버 -> 프론트로 데이터를 전해줄 API
  const [logInError, setLogInError] = useState(false);
  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');
  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setLogInError(false);
      axios
        .post(
          '/api/users/login',
          { email, password },
          {withCredentials: true,}
        )
        .then((response) => {
          mutate(response.data, false); //  & useSWR이 다시 실행되면서 data에 '내 정보(데이터)'를 넣어줌
        })
        .catch((error) => {
          setLogInError(error.response?.data?.statusCode === 401);
        });
    },
    [email, password],
  );

  // data가 false인 경우를 피하기 위해 undefined
  if (data === undefined) {
    return <div>로딩중...</div>;
  }

  // 로그인이 성공하면 Channel로 가게 된다.(리렌더링)
  if(data){
    return <Redirect to ="/workspace/sleact/channel/일반" />;
  }

  // console.log(error, userData);
  // if (!error && userData) {
  //   console.log('로그인됨', userData);
  //   return <Redirect to="/workspace/sleact/channel/일반" />;
  // }

  return (
    <div id="container">
      <Header>Sleact</Header>
      <Form onSubmit={onSubmit}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
          {logInError && <Error>이메일과 비밀번호 조합이 일치하지 않습니다.</Error>}
        </Label>
        <Button type="submit">로그인</Button>
      </Form>
      <LinkContainer>
        아직 회원이 아니신가요?&nbsp;
        <Link to="/signup">회원가입 하러가기</Link>
      </LinkContainer>
    </div>
  );
};

export default LogIn;