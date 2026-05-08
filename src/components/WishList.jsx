import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useProductStore } from "../store/useProductStore";
import "./scss/WishList.scss";
import CartPopup from "../pages/CartPopup";
import Cart from "../pages/Cart";
import UserInfoNone from "./UserInfoNone";
import WishItem from "./WishItem"; // ✅ 추가

export default function WishList() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { wishList, onRemoveWish, onLoadWishList, onAddCart } = useProductStore();

  const [checkedKeys, setCheckedKeys] = useState([]);
  const [showCartPopup, setShowCartPopup] = useState(false);
  const [cartItem, setCartItem] = useState(null);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      onLoadWishList(user.uid);
    }
  }, [user]);

  // 삭제된 상품 체크목록 제거
  useEffect(() => {
    const validKeys = wishList.map((p) => p.key);
    setCheckedKeys((prev) => prev.filter((k) => validKeys.includes(k)));
  }, [wishList]);

  // 품절 아이템 아래로 정렬
  const sortedWishList = [...wishList].sort(
    (a, b) => (a.isSoldOut ? 1 : 0) - (b.isSoldOut ? 1 : 0)
  );

  const isAllChecked =
    sortedWishList.length > 0 &&
    sortedWishList.every((p) => checkedKeys.includes(p.key));

  const handleAllCheck = (e) => {
    setCheckedKeys(e.target.checked ? sortedWishList.map((p) => p.key) : []);
  };

  const handleItemCheck = (key) => {
    setCheckedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleSelectedDelete = async () => {
    if (checkedKeys.length === 0) {
      alert("삭제할 상품을 선택해주세요.");
      return;
    }
    const targets = wishList.filter((p) => checkedKeys.includes(p.key));
    for (const p of targets) {
      await onRemoveWish(p.key, user.uid);
    }
    setCheckedKeys([]);
  };

  const handleSelectedOrder = () => {
    if (checkedKeys.length === 0) {
      alert("주문할 상품을 선택해주세요.");
      return;
    }
    const targets = wishList.filter((p) => checkedKeys.includes(p.key));
    const soldOutItems = targets.filter((p) => Boolean(p.isSoldOut));
    if (soldOutItems.length > 0) {
      const names = soldOutItems.map((p) => p.name).join(", ");
      alert(`아래 품절 상품은 주문이 불가합니다:\n${names}`);
      return;
    }
    alert(`${targets.length}개 상품 주문 진행`);
  };

  // ✅ WishItem에서 장바구니 버튼 클릭 시 호출
  const handleCartPopup = (wish) => {
    setCartItem(wish);
    setShowCartPopup(true);
  };

  // 비로그인
  if (!user) {
    return (
      <div className="wishlist-wrap">
        <div className="middle">
          <p className="empty">로그인 후 이용 가능합니다.</p>
          <button className="Bbtn" onClick={() => navigate("/login")}>
            로그인하러 가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="wishlist-wrap">
        <div className="middle">
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

          <ul className="wish-list">
            {wishList.length === 0 && (
              <li className="empty">
                <UserInfoNone title="상품" />
              </li>
            )}

            {sortedWishList.map((product) => (
              <li
                key={product.key}
                className={`items ${product.isSoldOut ? "is-soldout" : ""}`}
              >
                {/* ✅ 체크박스는 선택 상태 관리가 WishList에 있으므로 여기서 유지 */}
                <div>
                  <input
                    type="checkbox"
                    checked={checkedKeys.includes(product.key)}
                    onChange={() => handleItemCheck(product.key)}
                  />
                </div>

                {/* ✅ 상품 내용은 WishItem에 위임 */}
                <WishItem
                  wish={product}
                  variant="list"
                  onCartPopup={handleCartPopup}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="wishlist-bottom">
        <div className="bottom-button-box">
          <button className="Bbtn" onClick={handleSelectedOrder}>
            선택상품주문
          </button>
          <button className="Wbtn" onClick={handleSelectedDelete}>
            선택삭제
          </button>
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
    </>
  );
}