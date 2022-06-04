import useInput from '@hooks/useInput';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { useCallback, useState, VFC } from 'react';
import { Link, Redirect } from 'react-router-dom';
import useSWR from 'swr';
import { Form, Label, Input, LinkContainer, Button, Header, Error, Success } from './styles';

const SignUp = () => {
  // useSWR : 전역 스토리지(상태관리)
  const {data, error, mutate} = useSWR('http://localhost:3095/api/users', fetcher);

  const [email, onChangeEmail] = useInput('');
  const [nickname, onChangeNickname] = useInput('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [missMatchError, setMissMatchError] = useState(false);
  const [signUpError, setSignUpError] = useState('');
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  // const onChangeEmail = useCallback((e: any) =>{
  //   setEmail(e.target.value);
  // }, []);

  // const onChangeNickname = useCallback((e: any) =>{
  //   setNickname(e.target.value);
  // }, []);

  const onChangePassword = useCallback((e) => {
    setPassword(e.target.value); 
    setMissMatchError(e.target.value !== passwordCheck);
  }, [passwordCheck]);

  const onChangePasswordCheck = useCallback((e) => {
    setPasswordCheck(e.target.value);
    setMissMatchError(e.target.value !== password);
  }, [password]);

  const onSubmit = useCallback((e) => {
    e.preventDefault();
    console.log(email, nickname, password, passwordCheck);
    if(!missMatchError){
      console.log('submit!');
      // 로딩
      setSignUpError(''); // 비동기 시작전에 setSignUpError 초기화
      setSignUpSuccess(false); // 비동기 시작전에 setSignUpSuccess 초기화
      // 비동기 요청 보냄
      axios.post('/api/users', {
        email,
        nickname,
        password,
      })  
        .then((response) => { // 성공시
          console.log(response);
          setSignUpSuccess(true);
        }) 
        .catch((error) => {   // 실패시
          console.log(error.response);
          setSignUpError(error.response.data);
        })
        .finally(() => {}); //성공, 실패 모든 경우 실행
    }
  }, [email, nickname, password, passwordCheck, missMatchError]);

  // // data가 false인 경우를 피하기 위해 undefined
  // if (data === undefined) {
  //   return <div>로딩중...</div>;
  // }

  // 데이터가 있다면 채널로 이동
  if(data){
    return <Redirect to ="/workspace/sleact/channel/일반" />;
  }
  return (
    <div id="container">
      <Header>slack</Header>
      <Form onSubmit={onSubmit}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
        </Label>
        <Label id="nickname-label">
          <span>닉네임</span>
          <div>
            <Input type="text" id="nickname" name="nickname" value={nickname} onChange={onChangeNickname} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
        </Label>
        <Label id="password-check-label">
          <span>비밀번호 확인</span>
          <div>
            <Input
              type="password"
              id="password-check"
              name="password-check"
              value={passwordCheck}
              onChange={onChangePasswordCheck}
            />
          </div>
          {missMatchError && <Error>비밀번호가 일치하지 않습니다.</Error>}
          {!nickname && <Error>닉네임을 입력해주세요.</Error>}
          {signUpError && <Error>{signUpError}</Error>}
          {signUpSuccess && <Success>회원가입되었습니다! 로그인해주세요.</Success>}
        </Label>
        <Button type="submit">회원가입</Button>
      </Form>
      <LinkContainer>
        이미 회원이신가요?&nbsp;
        <Link to="/login">로그인 하러가기</Link>
      </LinkContainer>
    </div>
  );
};

export default SignUp;