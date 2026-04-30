import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useProductStore } from '../store/useProductStore';
import "./scss/WishList.scss"
export default function WishList() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { wishList, onRemoveWish, onLoadWishList } = useProductStore();

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
          {wishList.map((p) => (
            <li key={p.key} className='items'>
              <div >
                <input type="checkbox" />
              </div>
              <div className="img-box">
                <img src={p.mainImg} alt={p.name} />
              </div>
              <div>
                <div className="text-box">
                  <p className="title">{p.name}</p>
                  {p.discountRate > 0 ? (
                    <>
                      <strong className="discount-price">
                        {p.discountPrice?.toLocaleString()}원
                      </strong>
                      <span className="price">
                        {p.price?.toLocaleString()}원
                      </span>
                      <span className="discount-rate">
                        {p.discountRate}%
                      </span>
                    </>
                  ) : (
                    <strong>{p.price?.toLocaleString()}원</strong>
                  )}
                </div>
                <div className="option-box">
                  <p className="option">
                    {p.selectedColor} / {p.selectedSize} / {p.quantity}개
                  </p>
                </div>
                <div className="button-box">
                  <button>BUY IT NOW</button>
                  <button>ADD TO CART</button>
                  <button onClick={() => onRemoveWish(p.key, user.uid)}>
                    REMOVE
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="button-box">
          <button>선택상품주문</button>
          <button>선택삭제</button>
        </div>
      </div>

    </div>
  );
}