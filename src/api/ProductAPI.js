// 상품과 관련된 api 요청 함수들을 정의
// 가독성도 좋고 여러 곳에서 재사용할 수 있도록 함수로 만듦

import axios from "axios";

// 상품 목록 조회

// 특정 상품 조회

// 상품 더보기
export const getMoreProducts = async () => {
  try {
    const response = await axios.get('https://my-json-server.typicode.com/wlswnsgh/db-shop/more-products');
    
    if (response.status === 200) { // 응답 코드가 200 ok일때만 리턴
      return response.data;
    } else { // 서버가 에러 코드 전송 시
      throw new Error(`api error: ${response.status} ${response.statusText}`);
    }
    
  } catch (err) { // 서버가 죽었거나, 인터넷이 끊기거나, url이 잘못 됐을 때
    console.error(err);
  }

};