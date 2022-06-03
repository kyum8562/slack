/*
fetcher: 서버에서 주는 데이터를 받아옴(GET)
response.data 서버에서의 받아온 데이터 반환
response.data.length : 서버에서의 받아온 데이터길이 반환
이처럼 response.data 이외에도 서버에서 받는 데이터를 변행해 활용하면 좋다.
*/
import axios from "axios";
const fetcher = (url: string) => 
axios.get(url, {withCredentials: true,}).then((response) => response.data);

export default fetcher;