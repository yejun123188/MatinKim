import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useProductStore } from "../store/useProductStore";
import "./scss/WishList.scss";
import CartPopup from "../pages/CartPopup";
import Cart from "../pages/Cart";
import UserInfoNone from "./UserInfoNone";
import WishItem from "./WishItem";

export default function WishList() {
  const navigate = useNavigate();

  const { user } = useAuthStore();

  const { wishList, onRemoveWish, onLoadWishList } = useProductStore();

  const [checkedKeys, setCheckedKeys] = useState([]);
  const [showCartPopup, setShowCartPopup] = useState(false);
  const [cartItem, setCartItem] = useState(null);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      onLoadWishList(user.uid);
    }
  }, [user?.uid, onLoadWishList]);

  useEffect(() => {
    const validKeys = wishList.map((p) => p.key);
    setCheckedKeys((prev) => prev.filter((k) => validKeys.includes(k)));
  }, [wishList]);

  const sortedWishList = [...wishList].sort(
    (a, b) => (a.isSoldOut ? 1 : 0) - (b.isSoldOut ? 1 : 0)
  );

  const isAllChecked =
    sortedWishList.length > 0 &&
    sortedWishList.every((p) => checkedKeys.includes(p.key));

  const handleAllCheck = (event) => {
    setCheckedKeys(
      event.target.checked ? sortedWishList.map((p) => p.key) : []
    );
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

    const ok = window.confirm("위시리스트에서 상품을 취소하겠습니까?");
    if (!ok) return;

    const targets = wishList.filter((p) => checkedKeys.includes(p.key));

    for (const p of targets) {
      await onRemoveWish(p.key, user.uid);
    }

    setCheckedKeys([]);
    alert("위시리스트에서 상품이 삭제되었습니다.");
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

    const ok = window.confirm("선택한 상품을 주문하시겠습니까?");
    if (!ok) return;

    navigate("/payment", {
      state: {
        orderItems: targets.map((item) => ({
          id: item.id,
          brand: "MATIN KIM",
          name: item.name,
          option: `${item.selectedColor || "-"} / ${
            item.selectedSize || "-"
          }`,
          quantity: item.quantity || 1,
          price:
            item.discountRate > 0 ? item.discountPrice : item.price,
          image: item.mainImg || item.hoverImg || "",
          size: item.selectedSize,
          color: item.selectedColor,
        })),
      },
    });
  };

  const handleCartPopup = (wish) => {
    setCartItem(wish);
    setShowCartPopup(true);
  };

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
                <div>
                  <input
                    type="checkbox"
                    checked={checkedKeys.includes(product.key)}
                    onChange={() => handleItemCheck(product.key)}
                  />
                </div>

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