import { Button, Container, Row, Col, Alert, Form, Modal } from "react-bootstrap";
import { useNavigate, useParams } from 'react-router-dom';
import React,{ useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { clearSelectedProduct, getSelectedProduct, selectSelectProduct } from "../features/product/productSlice";
import { keyframes, styled } from "styled-components";
import { toast } from "react-toastify";
import { addItemToCart } from "../features/cart/cartSlice";

// 스타일드 컴포넌트를 이용한 애니메이션 속성 적용
const highlight = keyframes`
  from{ background-color: green; }
  50%{ background-color: yellow; }
  to{ background-color: red; }
`;

const StyledAlert = styled(Alert)`
  animation: ${highlight} 1s linear infinite; // linear 일정한 속도로 변한다 infinite을 뜻한다.
`;

function ProductDetail() {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const product = useSelector(selectSelectProduct);
  const [state, setstate] = useState(true); // 처음에는 화면에 보여야 되니까 true
  const [usete, setusete] = useState(1); // 주문수량 상태
  
  const [showModal, setShowModal] =useState(false); // 모달상태
  const handleCloseModal = () => setShowModal(false);
  const handleOpenModal = () => setShowModal(true);
  const navigate = useNavigate();

  const formatter = new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' });

  // 처음 마운트 했을 때 서버에 상품 id를 이용하여 데이터를 요청하고 
  // 그 결과를 리덕스 스토어에 저장
  useEffect(() => {
    // 서버에 특정 상품의 데이터 요청
    const fetchProductById = async () => {
      try {
        const response = await axios.get(`https://my-json-server.typicode.com/wlswnsgh/db-shop/products/${productId}`);
        console.log(response);
        dispatch(getSelectedProduct(response.data));
      } catch (err) {
        console.error(err);
      }
    }
    fetchProductById();

      // 상품 상세 페이지가 언마운트 될 때 전역 상태 초기화
      return () => {
        dispatch(clearSelectedProduct());
      };
  }, []);

  useEffect(() => { 
    
    const timer = setTimeout(() => {
      setstate(false); 
    }, 3000);
    
    // 불필요하게 타이머가 계속 쌓이는 것을 정리한다.
    // 만약 return을 안할 시 타이머가 계속 메모리에 쌓인다.
    return () => clearTimeout(timer); // 컴포넌트가 사라질 때 타이머 정리
  }, []); // 빈 배열을 넣어 처음 렌더링될 때 한 번만 실행

  // 상품 상세페이지에 들어갔을 때 해당 상품이 존재할때만 id값을 localStorage에 추가
  useEffect(() => {
    console.log(product);

    if (!product) {
      return;
    }

    // JSON.parse() 객체로 바꾸는 명령어
    let recentProducts = JSON.parse(localStorage.getItem('recentProducts')) || []; // 처음엔 null이니까 기본값으로 빈배열 넣어줌

    // id값을 넣기 전에 기존 배열에 존재하는지 검사하거나 아니면 일단 배열에 넣고 Set 자료형을 이용하여 중복 제거
    recentProducts.push(productId);
    recentProducts = new Set(recentProducts); // 배열을 Set 객체로 만듦(중복 요소가 제거됨)
    recentProducts = [...recentProducts]; // Set 객체를 다시 배열로 변환
    localStorage.setItem('recentProducts', JSON.stringify(recentProducts)); // JSON문자열로 저장
  }, [product]);

  const handleChange = (e) => {
    // 숫자 외 입력 시 유효성 검사 후 경고 토스트 띄우기
    if (isNaN(e.target.value)) {       
      toast.error('100 숫자만 입력하세요');
      return;
    }

    setusete(Number(e.target.value)); // 숫자로 바꾸고 싶다면 Number()명령어를 사용한다.
  };

  const handleClickCart = () => {
    dispatch((addItemToCart({
      ...product,
      count: usete
    })));
    handleOpenModal();
  };

  if (!product) {
    return null;
  }

  return (
    <Container className = "pt-3">
        
        {/* Alert를 띄우고 3초 뒤에 사라지게 만들기 
        (힌트:
        1) state 만들기
        2) 조건부 렌더링: 특정 조건이 충족될 때에만 화면에 특정 요소를 보여주거나 숨기는 것을 말해요
        3) 처음 렌더링 됐을 때 setTimeout으로 타이머 설정하여 state 바꾸기 
        */}

        {state && (<StyledAlert variant="info" onClose={() => setstate(false)} dismissible>현재 34명이 이 상품을 보고 있습니다.</StyledAlert>)}

      <Row>
        {/* Quiz: 데이터 바인딩 작업 */}
        {/* 바인딩 : 일반적으로 함수나 동작을 특정 이벤트나 조건에 연결하여 실행되도록 만드는 것 */}
        {/* 이벤트 : 사용자의 행동이나 브라우저의 동작을 의미합니다. 예) 클릭, 입력, 마우스 이동 등 */}
        <Col md={5}>
          <img src={product?.imagePath} width="80%"/>
        </Col>
        <Col md={4}>
          <h4 className="pt-5">{product?.title}</h4>
          <p>{product?.content}</p>
          <p>{formatter.format(product?.price)}원</p>

          <Col md={4} className="m-auto mb-3">
            {/* Quiz: text input을 제어 컴포넌트로 만들기 */}
            {/* Form.Control는 부트스트랩에 있는 (input)입력 필드를 만들때 사용된다. */}
            {/* 사용자가 입력한 내용은 컴포넌트의 상태로 저장되어 있다는 것을 의미한다. */}
            <Form.Control type = "text" onChange={handleChange} value={usete}/>

          </Col>
          <Button variant="primary">주문하기</Button>
          <Button variant="warning" onClick={() => handleClickCart()}>장바구니</Button>
        </Col>
      </Row>
      
      {/* 장바구니 모달 => 추후 범용적인 공통 모달로 만들고 구체화하여 사용하는 것이 좋음 */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>🛒 주노네 샵 알림</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          장바구니에 상품을 담았습니다.<br />
          장바구니로 이동하시겠습니까?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            취소
          </Button>
          <Button variant="primary" onClick={() => navigate('/cart')}>
            확인
          </Button>
        </Modal.Footer>
      </Modal>
      
    </Container>
  );
};

export default ProductDetail;