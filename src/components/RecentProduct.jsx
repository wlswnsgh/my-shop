import React from 'react';
import { Card, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const RecentProductsWrapper = styled(Card)`
  position: fixed;
  top: 100px;
  right: 20px;
  box-shadow: 4px 4px 10px 0 rgba(0, 0, 0, 0.25);
  width: 8rem;
`;

function RecentProduct(props) {
  const { productList } = props;

  const recentProducts = JSON.parse(localStorage.getItem('recentProducts'));
  const navigate = useNavigate();

  // 최근 본 상품이 없을 때는 렌더링 막기
  if(!recentProducts) return null;
  console.log(recentProducts);
  // id값으로 최근 본 상품들만 찾아서 배열로 만들기
  const recentProductsList = recentProducts.map(id => {
    
    return productList.find(product => product.id === id);
  });

  console.log(recentProductsList);

  return (
    <RecentProductsWrapper>
      <Card.Header>Featured</Card.Header>
      <ListGroup variant="flush">
        
        {recentProductsList.slice(0, 3).map(product => {
          // console.log(product);

          return (
            <React.Fragment key={product.id}>
              <img 
                src={product.imagePath} 
                alt={product.title}
                className="cursor-pointer"
                onClick={() => navigate(`/detail/${product.id}`)}
              />
              <ListGroup.Item className="text-ellipsis">{product.title}</ListGroup.Item>
            </React.Fragment>
          );
        })}
      </ListGroup>

      {recentProductsList.length > 3 && 
        <Card.Body>
          <Card.Link href='#'>더보기</Card.Link>
        </Card.Body>
      }
    </RecentProductsWrapper>
  );
}

export default RecentProduct;