import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useProductStore } from '../store/useProductStore';
import "./scss/WishList.scss"
import CartPopup from '../pages/CartPopup';
import Cart from '../pages/Cart';
import WishItem from './WishItem';

export default function WishList() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { wishList, onRemoveWish, onLoadWishList, onAddCart } = useProductStore();

  const [showCartPopup, setShowCartPopup] = useState(false);
  const [cartItem, setCartItem] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [checkedKeys, setCheckedKeys] = useState([]);

  // 로그인 유저 위시리스트 불러오기
  useEffect(() => {
    if (user?.uid) {
      onLoadWishList(user.uid);
    }
  }, [user]);

  // 위시리스트 변경 시 체크 상태에서 삭제된 항목 정리
  useEffect(() => {
    const validKeys = wishList.map((p) => p.key);
    setCheckedKeys((prev) => prev.filter((k) => validKeys.includes(k)));
  }, [wishList]);

  //품절된 상품은 리스트 아래뜨게
  const sortedWishList = [...wishList].sort((a, b) => {
    return (a.isSoldOut ? 1 : 0) - (b.isSoldOut ? 1 : 0);
  });

  // 전체선택 여부
  const isAllChecked =
    sortedWishList.length > 0 &&
    sortedWishList.every((p) => checkedKeys.includes(p.key));

  const handleAllCheck = (e) => {
    if (e.target.checked) {
      setCheckedKeys(sortedWishList.map((p) => p.key));
    } else {
      setCheckedKeys([]);
    }
  };

  const handleItemCheck = (key) => {
    setCheckedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  // remove 버튼 클릭 시
  const handleRemove = async (p) => {
    await onRemoveWish(p.key, user.uid);

  };

  // 선택 삭제
  const handleSelectedDelete = async () => {
    if (checkedKeys.length === 0) {
      alert('삭제할 상품을 선택해주세요.');
      return;
    }
    const targets = wishList.filter((p) => checkedKeys.includes(p.key));
    for (const p of targets) {
      await onRemoveWish(p.key, user.uid);
    }
    setCheckedKeys([]);
  };

  // 선택 상품 주문
  const handleSelectedOrder = () => {
    if (checkedKeys.length === 0) {
      alert('주문할 상품을 선택해주세요.');
      return;
    }
    const targets = wishList.filter((p) => checkedKeys.includes(p.key));
    const soldOutItems = targets.filter((p) => Boolean(p.isSoldOut));

    if (soldOutItems.length > 0) {
      const names = soldOutItems.map((p) => p.name).join(', ');
      alert(
        `아래 품절 상품은 주문이 불가합니다:\n${names}\n\n품절 상품을 제외하고 주문하시거나, 선택을 변경해주세요.`
      );
      return;
    }

    // 품절 없는 경우  실제 주문 
    alert(`${targets.length}개 상품 주문을 진행합니다.`);
    // navigate('/order', { state: { items: targets } }) 
  };

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
          <input
            type="checkbox"
            checked={isAllChecked}
            onChange={handleAllCheck}
          />
          전체선택
        </label>
      </div>

      <div className="middle">
        <ul className="wish-list">
          {wishList.length === 0 && (
            <li className="empty">찜한 상품이 없습니다.</li>
          )}

          {sortedWishList.map((p) => {
            const isSoldOut = Boolean(p.isSoldOut);
            const isChecked = checkedKeys.includes(p.key);

            return (
              <li key={p.key} className={`items ${isSoldOut ? "is-soldout" : ""}`}>
                <div>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleItemCheck(p.key)}
                  />
                </div>
                <WishItem
                  wish={p}
                  variant="list"
                  onCartPopup={(item) => {
                    setCartItem(item);
                    setShowCartPopup(true);
                  }}
                />
              </li>
            );
          })}


        </ul>

        <div className="button-box">
          <button onClick={handleSelectedOrder}>선택상품주문</button>
          <button onClick={handleSelectedDelete}>선택삭제</button>
        </div>
      </div>

      {showCartPopup && (
        <CartPopup
          mode="best"
          product={cartItem}
          selectedColor={cartItem?.selectedColor}
          selectedSize={cartItem?.selectedSize}
          quantity={cartItem?.quantity}
          onClose={() => setShowCartPopup(false)}
          onGoCart={() => {
            setShowCartPopup(false);
            setShowCart(true);
          }}
        />
      )}
      {showCart && <Cart onClose={() => setShowCart(false)} />}
    </div>
  );
}