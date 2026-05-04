import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useProductStore } from '../store/useProductStore';
import "./scss/WishList.scss"
import CartPopup from '../pages/CartPopup';
import Cart from '../pages/Cart';
export default function WishList() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { wishList, onRemoveWish, onLoadWishList, onAddCart } = useProductStore();
  //장바구니 팝업 열었다 닫았다 체크
  const [showCartPopup, setShowCartPopup] = useState(false)
  const [cartItem, setCartItem] = useState(null);
  const [showCart, setShowCart] = useState(false);
  //remove버튼 클릭시
  const handleRemove = async (p) => {
    await onRemoveWish(p.key, user.uid)
    alert("상품이 삭제되었습니다")

  }
  // 로그인 유저 위시리스트 불러오기
  useEffect(() => {
    if (user?.uid) {
      onLoadWishList(user.uid);
    }
  }, [user]);

  // 비로그인 상태
  if (!user) {
    return (
      <div className="wishlist-wrap">
        <p>로그인 후 이용 가능합니다.</p>
        <button onClick={() => navigate('/login')}>로그인하러 가기</button>
      </div>
    );
  }

  const sortedWishList = [...wishList].sort((a, b) => {
    return (a.isSoldOut ? 1 : 0) - (b.isSoldOut ? 1 : 0);
  });

  return (
    <div className="wishlist-wrap">
      <div className="top">
        <label>
          <input type="checkbox" />
          전체선택
        </label>
      </div>
      <div className="middle">
        <ul className="wish-list">
          {wishList.length === 0 && (
            <li className="empty">찜한 상품이 없습니다.</li>
          )}

          {sortedWishList.map((p) => {
            // 선택된 사이즈의 인덱스를 찾아 soldout 여부 확인
            const sizeIndex = (p.sizes || []).findIndex(s => s === p.selectedSize);
            const isSoldOut = Boolean(p.isSoldOut);
            console.log('soldout:', p.soldout);
            console.log('selectedSize:', p.selectedSize);
            return (
              <li key={p.key} className={`items ${isSoldOut ? 'is-soldout' : ''}`}>
                <div>
                  <input type="checkbox" />
                </div>
                <div className="img-box" onClick={() => navigate(`/products/${p.id}`)}>
                  <img src={p.mainImg} alt={p.name} />
                </div>
                <div>
                  <div className="text-box">
                    <p className="title" onClick={() => navigate(`/products/${p.id}`)}>{p.name}</p>

                    {p.discountRate > 0 ? (
                      <div className='price-box'>
                        <strong className="discount-price">
                          ₩{p.discountPrice?.toLocaleString()}원
                        </strong>
                        <span className="price">
                          {p.price?.toLocaleString()}원
                        </span>
                        <span className="discount-rate">
                          {p.discountRate}%
                        </span>
                      </div>
                    ) : (
                      <strong className='price2'>₩{p.price?.toLocaleString()}원</strong>
                    )}
                  </div>

                  {/* 솔드아웃이면 옵션 숨김 */}
                  {!isSoldOut && (
                    <div className="option-box">
                      <p className="option">
                        {p.selectedColor} /  {p.selectedSize} /  {p.quantity}개
                      </p>
                    </div>
                  )}
                  {isSoldOut && (
                    <span className="soldout-badge">SOLD OUT</span>
                  )}

                  <div className="button-box">
                    {/* 솔드아웃이면 Buy / Cart 버튼 숨김 */}
                    {!isSoldOut && (
                      <>
                        <button>Buy It Now</button>
                        <button onClick={() => {
                          const item = {
                            id: p.id,
                            name: p.name,
                            price: p.price,
                            discountPrice: p.discountPrice,
                            discountRate: p.discountRate,
                            mainImg: p.mainImg,
                            hoverImg: p.hoverImg, image: p.mainImg || p.hoverImg,
                            key: `${p.id}-${p.selectedSize}-${p.selectedColor}`
                          };
                          setCartItem(p);
                          setShowCartPopup(true);
                          onAddCart({ ...item, size: p.selectedSize, color: p.selectedColor, count: p.quantity });
                        }}

                        >Add To Cart</button>
                      </>
                    )}
                    <button onClick={() => {
                      handleRemove(p)
                    }}>
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="button-box">
          <button>선택상품주문</button>
          <button>선택삭제</button>
        </div>
      </div>
      {showCartPopup && <CartPopup
        mode="best"
        product={cartItem}
        selectedColor={cartItem?.selectedColor}
        selectedSize={cartItem?.selectedSize}
        quantity={cartItem?.quantity}
        onClose={() => setShowCartPopup(false)}
        onGoCart={() => {
          setShowCartPopup(false);
          setShowCart(true);
        }} />}
      {showCart && <Cart onClose={() => setShowCart(false)} />}
    </div >
  );
}