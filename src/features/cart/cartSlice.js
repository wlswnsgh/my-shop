import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartList: [
    {
      id: '1',
      title: "Arcsaber 11 Pro",
      price: 299000,
      count: 2
    },
    {
      id: '3',
      title: "Aerus Z",
      price: 199000,
      count: 1
    },
  ]
};

// 장바구니 정보를 담을 slice 만들기
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // 수량을 변경하는 리듀서 만들기
    // Quiz: 전달받은 상품의 id값으로 cartList에서 해당 상품을 찾아 수량을 1씩 증가/감소
    increaseCount: (state, action) => {
      const targetItem = state.cartList.find(cartItem => cartItem.id === action.payload);
      targetItem.count += 1;
    },
    decreaseCount: (state, { payload: productId }) => {
      const targetItem = state.cartList.find(cartItem => cartItem.id === productId);
      targetItem.count -= 1;
    },
    // 상품 객체로 넘겨주면 cartList에 아이템을 추가하는 리듀서 만들기 
    // 이미 들어있는 상품이면 수량만 증가
    // 장바구니에 없는 상품이면 새롭게 추가
    addItemToCart: (state, { payload: product }) => {
      console.log(product);
      const target = state.cartList.find(cartItem => cartItem.id === product.id);

      if (target) {
        target.count += product.count;
      } else {
        state.cartList.push(product);
      }
    },
    // Quiz: 장바구니에서 삭제하는 리듀서 만들기
    // 1. state, action으로 매개변수를 지정한다.(state는 장바구니 상태를 나타내고 action는 전달하는 정보를 뜻한다.)
    // 2. state.cartList.filter()는 filter()명령어를 사용해 cartList를 걸러내는 작업을 한다.
    // 3. item => item.id !== action.payload는 id와 payload를 비교해서 서로 다르면 제거한다.
    // 4. state.cartList에서 새로운 배열을 할당함으로써 해당 상품이 제거된 장바구니를 업데이트를 한다.
    // 5. 삭제하려는 상품의 ID를 action.payload로 전달해 해당 상품을 제거 할 수 있다.
    removeItemFromCart: (state, action) => {
      state.cartList = state.cartList.filter(item => item.id !== action.payload);
    },
  }
});

export const selectCartList = state => state.cart.cartList;

export const { 
  increaseCount, 
  decreaseCount, 
  addItemToCart,
  removeItemFromCart } = cartSlice.actions;

export default cartSlice.reducer;

// error: failed to push some refs to 'https://github.com/wlswnsgh/frontend-study.git' 
